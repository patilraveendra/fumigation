import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCertificate, fetchCertificates, type CertificateRecord } from '../api/apiService';
import type { AuthUser } from '../App';
import type { CertificateData } from '../types/certificate';

interface SavedCertificatesProps {
    onBack: () => void;
    onLogout?: () => void;
    initialType?: 'MB' | 'ALP' | 'AUS';
    authUser?: AuthUser | null;
}

type SortKey = 'recent' | 'certificateNumber' | 'dateIssued' | 'party' | 'exporter';

type SavedCertificateFilters = {
    certificateNo: string;
    billingParty: string;
    exporter: string;
    workOrder: string;
    containerNo: string;
    country: string;
    certDateFrom: string;
    certDateTo: string;
    fumigationFrom: string;
    fumigationTo: string;
    dosageRate: string;
    category: string;
};

const emptyFilters: SavedCertificateFilters = {
    certificateNo: '',
    billingParty: '',
    exporter: '',
    workOrder: '',
    containerNo: '',
    country: '',
    certDateFrom: '',
    certDateTo: '',
    fumigationFrom: '',
    fumigationTo: '',
    dosageRate: '',
    category: '',
};

function getPartyName(data: Partial<CertificateData>) {
    return data.consigneeName || data.exporterName || data.clientName || 'Unknown party';
}

function compactContainerValue(containers: Array<{ cont?: string; seal?: string }> | undefined) {
    const values = (containers ?? [])
        .map((container) => container.cont)
        .filter((value): value is string => Boolean(value && value.trim()));

    if (values.length === 0) return '—';
    if (values.length <= 2) return values.join(', ');

    return `${values.slice(0, 2).join(', ')} +${values.length - 2} more`;
}

function normalizeDate(value?: string) {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getAppliedFilterCount(filters: SavedCertificateFilters) {
    return Object.values(filters).filter((value) => value && value.trim() !== '').length;
}

function getFilterSummary(filters: SavedCertificateFilters) {
    const summary: string[] = [];

    if (filters.certificateNo) summary.push(`Certificate: ${filters.certificateNo}`);
    if (filters.containerNo) summary.push(`Container: ${filters.containerNo}`);
    if (filters.billingParty) summary.push(`Billing: ${filters.billingParty}`);
    if (filters.exporter) summary.push(`Exporter: ${filters.exporter}`);
    if (filters.country) summary.push(`Country: ${filters.country}`);
    if (filters.certDateFrom || filters.certDateTo) summary.push(`Cert date: ${filters.certDateFrom || 'Any'} → ${filters.certDateTo || 'Any'}`);
    if (filters.fumigationFrom || filters.fumigationTo) summary.push(`Fumigation: ${filters.fumigationFrom || 'Any'} → ${filters.fumigationTo || 'Any'}`);

    return summary.slice(0, 3);
}

function SavedCertificates({ onBack, onLogout, initialType, authUser }: SavedCertificatesProps) {
    const [records, setRecords] = useState<CertificateRecord[]>([]);
    const [selectedRecordId, setSelectedRecordId] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<'MB' | 'ALP' | 'AUS'>(initialType ?? 'MB');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortKey>('recent');
    const [pageSize, setPageSize] = useState<number>(25);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isSearchExpanded, setIsSearchExpanded] = useState(true);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filters, setFilters] = useState<SavedCertificateFilters>(emptyFilters);

    const isAdmin = authUser?.role === 'admin';
    const navigate = useNavigate();
    const filterSummary = getFilterSummary(filters);
    const hasFilters = getAppliedFilterCount(filters) > 0;

    const reloadCertificates = async () => {
        setIsLoading(true);
        setStatus(null);

        try {
            const fetched = await fetchCertificates();
            setRecords(fetched);
            setStatus(`${fetched.length} certificate(s) loaded.`);
            setCurrentPage((prev) => Math.min(prev, Math.max(1, Math.ceil(fetched.length / pageSize))));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            setStatus(`Failed to load certificates: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void reloadCertificates();
    }, []);

    useEffect(() => {
        if (initialType) {
            setSelectedType(initialType);
        }
    }, [initialType]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, pageSize, sortBy, filters]);

    const filteredRecords = useMemo(() => {
        const query = (value?: string | null) => (value ?? '').trim().toLowerCase();

        const matchesFilter = (record: CertificateRecord) => {
            const data = record.data;
            if ((data.certificateType ?? 'MB') !== selectedType) return false;

            if (filters.certificateNo && !query(data.certificateNumber).includes(query(filters.certificateNo))) return false;
            if (filters.billingParty && ![data.clientName, data.consigneeName, data.exporterName].some((value) => query(value).includes(query(filters.billingParty)))) return false;
            if (filters.exporter && !query(data.exporterName).includes(query(filters.exporter))) return false;
            if (filters.workOrder && ![data.shippingMark, data.workOrder, data.invoiceNumber].some((value) => query(value).includes(query(filters.workOrder)))) return false;
            if (filters.containerNo && !((data.containers ?? []).some((container) => query(container.cont).includes(query(filters.containerNo))))) return false;
            if (filters.country && ![data.destinationCountry, data.countryOfOrigin, data.placeCountry].some((value) => query(value).includes(query(filters.country)))) return false;

            const certDate = normalizeDate(data.dateIssued);
            if (filters.certDateFrom && (!certDate || certDate < new Date(`${filters.certDateFrom}T00:00:00`))) return false;
            if (filters.certDateTo && (!certDate || certDate > new Date(`${filters.certDateTo}T23:59:59`))) return false;

            const fumDate = normalizeDate(data.fumigationStarted ?? data.f_starttime ?? data.f_date);
            if (filters.fumigationFrom && (!fumDate || fumDate < new Date(`${filters.fumigationFrom}T00:00:00`))) return false;
            if (filters.fumigationTo && (!fumDate || fumDate > new Date(`${filters.fumigationTo}T23:59:59`))) return false;

            return true;
        };

        const sorted = [...records.filter(matchesFilter)].sort((a, b) => {
            const aData = a.data;
            const bData = b.data;

            switch (sortBy) {
                case 'certificateNumber':
                    return (aData.certificateNumber ?? '').localeCompare(bData.certificateNumber ?? '', undefined, { numeric: true, sensitivity: 'base' });
                case 'dateIssued':
                    return (normalizeDate(bData.dateIssued)?.getTime() ?? 0) - (normalizeDate(aData.dateIssued)?.getTime() ?? 0);
                case 'party':
                    return getPartyName(bData).localeCompare(getPartyName(aData));
                case 'exporter':
                    return (bData.exporterName ?? '').localeCompare(aData.exporterName ?? '');
                case 'recent':
                default:
                    return new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime();
            }
        });

        return sorted;
    }, [records, selectedType, filters, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const displayRecords = filteredRecords.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

    const handlePageChange = (nextPage: number) => {
        const boundedPage = Math.min(Math.max(1, nextPage), totalPages);
        setCurrentPage(boundedPage);
    };

    const handlePageSizeChange = (nextPageSize: number) => {
        setPageSize(nextPageSize);
        setCurrentPage(1);
    };

    const openInPrintTab = (record: CertificateRecord) => {
        try {
            sessionStorage.setItem('printData', JSON.stringify(record.data));
            localStorage.setItem('printData', JSON.stringify(record.data));
            window.open('/print', '_blank');
        } catch (error) {
            console.error('Failed to open print tab', error);
            setStatus('Failed to open print tab.');
        }
    };

    const handleEdit = (record: CertificateRecord) => {
        try {
            const type = (record.data.certificateType ?? 'MB') as 'MB' | 'ALP' | 'AUS';
            let path = '/create/mbr/form';
            if (type === 'ALP') path = '/create/alp/form';
            if (type === 'AUS') path = '/create/aus/form';
            navigate(path, { state: { initialValues: record.data } });
        } catch (error) {
            console.error('Failed to open edit form', error);
            setStatus('Failed to open edit form');
        }
    };

    const handleDelete = async (record: CertificateRecord) => {
        if (!isAdmin) return;

        const type = (record.data.certificateType ?? 'MB') as 'MB' | 'ALP' | 'AUS';
        const certificateId = (record as any).certificateId ?? (record as any).id;
        if (!certificateId) {
            setStatus('This certificate does not have an ID and cannot be deleted.');
            return;
        }

        const confirmed = window.confirm(`Delete this ${type} certificate? This action cannot be undone.`);
        if (!confirmed) return;

        setIsDeleting(record.id);
        setStatus(null);

        try {
            await deleteCertificate(type, String(certificateId));
            setRecords((prev) => prev.filter((item) => item.id !== record.id));
            setStatus(`${type} certificate deleted successfully.`);
            if (selectedRecordId === record.id) setSelectedRecordId('');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            setStatus(`Delete failed: ${message}`);
        } finally {
            setIsDeleting(null);
        }
    };

    const updateFilter = (field: keyof SavedCertificateFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="page-shell">
            <header className="page-header">
                <div className="page-header__main">
                    <div>
                        <h1>Certificates</h1>
                        <p>Manage and search fumigation certificates.</p>
                    </div>
                    <button type="button" className="primary-button" onClick={() => navigate('/create/mbr')}>
                        + Issue Certificate
                    </button>
                </div>
            </header>

            <section className="data-panel">
                <div className="panel-header">
                    <button type="button" className="panel-toggle" onClick={() => setIsSearchExpanded((v) => !v)}>
                        <span>Search certificates</span>
                        {hasFilters ? <span className="badge-soft">{filterSummary.length} filters applied</span> : null}
                        <span className="chevron">{isSearchExpanded ? '⌃' : '⌄'}</span>
                    </button>
                </div>

                {isSearchExpanded ? (
                    <div className="panel-content">
                        <div className="search-grid.primary">
                            <div className="field-item">
                                <label htmlFor="certificate-no">Certificate No.</label>
                                <input id="certificate-no" type="text" value={filters.certificateNo} onChange={(e) => updateFilter('certificateNo', e.target.value)} placeholder="Select certificate" />
                            </div>
                            <div className="field-item">
                                <label htmlFor="container-number">Container No.</label>
                                <input id="container-number" type="text" value={filters.containerNo} onChange={(e) => updateFilter('containerNo', e.target.value)} placeholder="Enter container number" />
                            </div>
                            <div className="field-item">
                                <label htmlFor="billing-party">Billing Party</label>
                                <input id="billing-party" type="text" value={filters.billingParty} onChange={(e) => updateFilter('billingParty', e.target.value)} placeholder="Select billing party" />
                            </div>
                            <div className="field-item">
                                <label htmlFor="exporter">Exporter</label>
                                <input id="exporter" type="text" value={filters.exporter} onChange={(e) => updateFilter('exporter', e.target.value)} placeholder="Select exporter" />
                            </div>
                        </div>

                        {showAdvancedFilters ? (
                            <div className="advanced-filters">
                                <div className="advanced-grid">
                                    <div className="field-item field-item--date">
                                        <label>Certificate Date</label>
                                        <div className="field-pair">
                                            <div className="input-with-label">
                                                <span>From</span>
                                                <input type="date" value={filters.certDateFrom} onChange={(e) => updateFilter('certDateFrom', e.target.value)} />
                                            </div>
                                            <div className="input-with-label">
                                                <span>To</span>
                                                <input type="date" value={filters.certDateTo} onChange={(e) => updateFilter('certDateTo', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field-item field-item--date">
                                        <label>Fumigation Date</label>
                                        <div className="field-pair">
                                            <div className="input-with-label">
                                                <span>From</span>
                                                <input type="date" value={filters.fumigationFrom} onChange={(e) => updateFilter('fumigationFrom', e.target.value)} />
                                            </div>
                                            <div className="input-with-label">
                                                <span>To</span>
                                                <input type="date" value={filters.fumigationTo} onChange={(e) => updateFilter('fumigationTo', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field-item">
                                        <label htmlFor="work-order">W.O. No.</label>
                                        <input id="work-order" type="text" value={filters.workOrder} onChange={(e) => updateFilter('workOrder', e.target.value)} placeholder="Select W.O." />
                                    </div>

                                    <div className="field-item">
                                        <label htmlFor="country">Country</label>
                                        <input id="country" type="text" value={filters.country} onChange={(e) => updateFilter('country', e.target.value)} placeholder="Select country" />
                                    </div>

                                    <div className="field-item">
                                        <label htmlFor="dosage-rate">Dosage Rate of Fumigant</label>
                                        <input id="dosage-rate" type="text" value={filters.dosageRate} onChange={(e) => updateFilter('dosageRate', e.target.value)} placeholder="Select dosage" />
                                    </div>

                                    <div className="field-item">
                                        <label htmlFor="category">Category</label>
                                        <input id="category" type="text" value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} placeholder="Select category" />
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {hasFilters ? (
                            <div className="filter-summary-row">
                                <div className="filter-summary-label">Filters applied</div>
                                <div className="filter-summary-chips">
                                    {filterSummary.map((item) => (
                                        <span key={item} className="filter-chip">{item}</span>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        <div className="panel-actions panel-actions--compact">
                            <button type="button" className="text-link text-link--inline" onClick={() => setShowAdvancedFilters((value) => !value)}>
                                {showAdvancedFilters ? 'Hide filters' : 'More filters'}
                            </button>
                            <button type="button" className="secondary-button secondary-button--compact" onClick={() => setFilters(emptyFilters)}>Clear</button>
                            <button type="button" className="primary-button primary-button--compact" onClick={() => void reloadCertificates()}>Search</button>
                        </div>
                    </div>
                ) : (
                    <div className="panel-collapsed">
                        <span>Search certificates</span>
                        {hasFilters ? <span className="collapsed-summary">{filterSummary.length} filters applied</span> : null}
                        <button type="button" className="text-link" onClick={() => setIsSearchExpanded(true)}>Expand</button>
                    </div>
                )}
            </section>

            <section className="results-panel">
                <div className="results-panel__header">
                    <div className="results-panel__title-wrap">
                        <h2>Certificates</h2>
                        <span className="record-count">{filteredRecords.length.toLocaleString()} records</span>
                    </div>

                    <div className="results-toolbar">
                        <div className="toolbar-field">
                            <label htmlFor="sort-select">Sort by</label>
                            <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
                                <option value="recent">Recent</option>
                                <option value="certificateNumber">Certificate No</option>
                                <option value="dateIssued">Date</option>
                                <option value="party">Billing Party</option>
                                <option value="exporter">Exporter</option>
                            </select>
                        </div>

                        <div className="toolbar-field">
                            <label htmlFor="page-size-select">Rows</label>
                            <select id="page-size-select" value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        <button type="button" className="secondary-button secondary-button--compact" onClick={() => void reloadCertificates()}>Refresh</button>
                        <button type="button" className="secondary-button secondary-button--compact" onClick={() => {
                            const currentPageRecords = filteredRecords.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);
                            if (currentPageRecords.length > 0) {
                                openInPrintTab(currentPageRecords[0]);
                            }
                        }}>Print</button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="table-loading" aria-live="polite">
                        <div className="skeleton-row" />
                        <div className="skeleton-row" />
                        <div className="skeleton-row" />
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="certificate-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Operator</th>
                                        <th>Certificate No.</th>
                                        <th>C Date</th>
                                        <th>Billing Party</th>
                                        <th>Exporter</th>
                                        <th>Exp. Inv. No.</th>
                                        <th>Container No.</th>
                                        <th>PAS Invoice No.</th>
                                        <th>W.O. No.</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan={12} className="empty-state-cell">
                                                <div className="empty-state">
                                                    <h3>No certificates found</h3>
                                                    <p>Try adjusting your search filters and search again.</p>
                                                    <button type="button" className="secondary-button secondary-button--compact" onClick={() => setFilters(emptyFilters)}>Clear Filters</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        displayRecords.map((record, index) => (
                                            <tr key={record.id}>
                                                <td>{(safeCurrentPage - 1) * pageSize + index + 1}</td>
                                                <td>{authUser?.username ?? 'Admin'}</td>
                                                <td>
                                                    <button type="button" className="link-button" onClick={() => { setSelectedRecordId(record.id); openInPrintTab(record); }}>
                                                        {record.data.certificateNumber ?? '—'}
                                                    </button>
                                                </td>
                                                <td>{record.data.dateIssued ? new Date(record.data.dateIssued).toLocaleDateString() : '—'}</td>
                                                <td>{getPartyName(record.data)}</td>
                                                <td>{record.data.exporterName ?? '—'}</td>
                                                <td>{record.data.invoiceNumber ?? '—'}</td>
                                                <td>{compactContainerValue(record.data.containers)}</td>
                                                <td>{record.data.invoiceNumber ?? '—'}</td>
                                                <td>{record.data.shippingMark ?? record.data.workOrder ?? '—'}</td>
                                                <td>
                                                    <span className="status-badge status-badge--issued">Issued</span>
                                                </td>
                                                <td>
                                                    <div className="row-actions">
                                                        <button type="button" className="ghost-button" onClick={() => openInPrintTab(record)}>View</button>
                                                        <button type="button" className="ghost-button" onClick={() => handleEdit(record)}>Edit</button>
                                                        <button
                                                            type="button"
                                                            className="ghost-button danger"
                                                            onClick={() => void handleDelete(record)}
                                                            disabled={!isAdmin || isDeleting === record.id}
                                                            title={isAdmin ? 'Delete certificate' : 'Only admin can delete certificates'}
                                                        >
                                                            {isDeleting === record.id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-footer">
                            <div className="table-footer__text">
                                Showing {filteredRecords.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}-{Math.min(safeCurrentPage * pageSize, filteredRecords.length)} of {filteredRecords.length}
                            </div>
                            <div className="table-footer__controls">
                                <button type="button" className="page-button" disabled={safeCurrentPage === 1} onClick={() => handlePageChange(safeCurrentPage - 1)} aria-label="Previous page">‹</button>
                                <span className="page-indicator">{safeCurrentPage} / {totalPages}</span>
                                <button type="button" className="page-button" disabled={safeCurrentPage >= totalPages} onClick={() => handlePageChange(safeCurrentPage + 1)} aria-label="Next page">›</button>
                            </div>
                            <div className="toolbar-field compact">
                                <label htmlFor="footer-page-size">Rows per page</label>
                                <select id="footer-page-size" value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {status ? <div className="status-banner" role="status">{status}</div> : null}
        </div>
    );
}

export default SavedCertificates;
