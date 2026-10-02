import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCertificate, fetchCertificates, pingApi, type CertificateRecord } from '../api/apiService';
import { type CertificateData } from '../types/certificate';
import MbPrint from './MbPrint';
import AlpPrint from './AlpPrint';
import './CertificateForm.compact.css';
import type { AuthUser } from '../App';

interface SavedCertificatesProps {
    onBack: () => void;
    onLogout?: () => void;
    initialType?: 'MB' | 'ALP' | 'AUS';
    authUser?: AuthUser | null;
}

function getPartyName(data: Partial<CertificateData>) {
    return data.consigneeName || data.exporterName || data.clientName || 'Unknown party';
}

function SavedCertificates({ onBack, onLogout, initialType, authUser }: SavedCertificatesProps) {
    const [records, setRecords] = useState<CertificateRecord[]>([]);
    const [selectedRecordId, setSelectedRecordId] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<'MB' | 'ALP' | 'AUS'>(initialType ?? 'MB');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const isAdmin = authUser?.role === 'admin';

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setStatus(null);

            try {
                const fetched = await fetchCertificates();
                setRecords(fetched);
                setStatus(`${fetched.length} certificate(s) loaded.`);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                setStatus(`Failed to load certificates: ${message}`);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    const testApi = async () => {
        setIsLoading(true);
        try {
            const r = await pingApi();
            setStatus(`API ping: status=${r.status} ok=${r.ok} body=${typeof r.body === 'string' ? r.body.slice(0, 200) : ''}`);
        } catch (err) {
            setStatus(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    const selectedRecord = records.find((record) => record.id === selectedRecordId);
    const [showJson, setShowJson] = useState(false);
    const filteredRecords = records.filter((r) => (r.data.certificateType ?? 'MB') === selectedType);
    const navigate = useNavigate();

    const openInPrintTab = (record: CertificateRecord) => {
        try {
            // debug: log record metadata and containers so we can confirm shape
            try { console.debug('openInPrintTab: certificateNumber=', record.data.certificateNumber, 'certificateId=', (record.data as any).certificateId, 'containers=', record.data.containers); } catch { }
            // write to both sessionStorage and localStorage so new tabs can read it
            try { sessionStorage.setItem('printData', JSON.stringify(record.data)); } catch { }
            try { localStorage.setItem('printData', JSON.stringify(record.data)); } catch { }
            window.open('/print', '_blank');
        } catch (e) {
            console.error('Failed to open print tab', e);
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
        } catch (e) {
            console.error('Failed to open edit form', e);
            setStatus('Failed to open edit form');
        }
    };

    const handleDelete = async (record: CertificateRecord) => {
        if (!isAdmin) {
            return;
        }

        const type = (record.data.certificateType ?? 'MB') as 'MB' | 'ALP' | 'AUS';
        const certificateId = (record as any).certificateId ?? (record as any).id;
        if (!certificateId) {
            setStatus('This certificate does not have an ID and cannot be deleted.');
            return;
        }

        const confirmed = window.confirm(`Delete this ${type} certificate? This action cannot be undone.`);
        if (!confirmed) {
            return;
        }

        setIsDeleting(record.id);
        setStatus(null);

        try {
            await deleteCertificate(type, String(certificateId));
            setRecords((prev) => prev.filter((item) => item.id !== record.id));
            setStatus(`${type} certificate deleted successfully.`);
            if (selectedRecordId === record.id) {
                setSelectedRecordId('');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            setStatus(`Delete failed: ${message}`);
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row align-items-center mb-4">
                <div className="col">
                    <p className="text-muted mb-1">Saved Certificates</p>
                    <h2 className="mb-0">Saved Fumigation Certificates</h2>
                    <p className="text-muted">Select a certificate from the table below to view its details.</p>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => (onBack ? onBack() : navigate('/form'))}>Back to create</button>
                    {onLogout ? <button type="button" className="btn btn-outline-secondary" onClick={onLogout}>Logout</button> : null}
                </div>
            </div>

            <div className="mb-3">
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <button className={`nav-link ${selectedType === 'MB' ? 'active' : ''}`} onClick={() => setSelectedType('MB')}>
                            MBR Certificates <span className="badge bg-light text-dark ms-2">{records.filter(r => (r.data.certificateType ?? 'MB') === 'MB').length}</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${selectedType === 'ALP' ? 'active' : ''}`} onClick={() => setSelectedType('ALP')}>
                            ALP Certificates <span className="badge bg-light text-dark ms-2">{records.filter(r => r.data.certificateType === 'ALP').length}</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${selectedType === 'AUS' ? 'active' : ''}`} onClick={() => setSelectedType('AUS')}>
                            AUS Certificates <span className="badge bg-light text-dark ms-2">{records.filter(r => r.data.certificateType === 'AUS').length}</span>
                        </button>
                    </li>
                </ul>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card mb-3">
                        <div className="card-header">Certificate list</div>
                        <div className="card-body">
                            {isLoading ? <p>Loading certificates…</p> : null}
                            {status ? <div className="alert alert-info">{status}</div> : null}

                            <div className="mb-3">
                                <button className="btn btn-sm btn-outline-secondary" onClick={testApi}>Test API</button>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Certificate #</th>
                                            <th>Date</th>
                                            <th>Party</th>
                                            <th>Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRecords.length === 0 ? (
                                            <tr>
                                                <td colSpan={5}>No certificates found for {selectedType}.</td>
                                            </tr>
                                        ) : (
                                            filteredRecords.map((record) => (
                                                <tr key={record.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedRecordId(record.id)}>
                                                    <td>{record.data.certificateNumber ?? '—'}</td>
                                                    <td>{record.data.dateIssued ? new Date(record.data.dateIssued).toLocaleDateString() : '—'}</td>
                                                    <td>{getPartyName(record.data)}</td>
                                                    <td>{record.data.certificateType ?? '—'}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); setSelectedRecordId(record.id); openInPrintTab(record); }}>View</button>
                                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => { e.stopPropagation(); handleEdit(record); }}>Edit</button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={(e) => { e.stopPropagation(); void handleDelete(record); }}
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
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default SavedCertificates;
