import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCertificates, type CertificateRecord } from '../api/apiService';
import { type CertificateData } from '../types/certificate';
import './CertificateForm.compact.css';

interface ReportRow {
    certificateNumber: string;
    dateIssued: string;
    containerNumbers: string;
    sealNumbers: string;
    exporter: string;
    consignee: string;
    destination: string;
    fumigantName: string;
    fumigationStarted: string;
    fumigationCompleted: string;
    rawData: Partial<CertificateData>;
}

function CertificateReport({ onLogout, onBack }: { onLogout?: () => void; onBack?: () => void }) {
    const navigate = useNavigate();
    const [records, setRecords] = useState<CertificateRecord[]>([]);
    const [selectedType, setSelectedType] = useState<'MB' | 'ALP' | 'AUS'>('MB');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [reportData, setReportData] = useState<ReportRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    // Load all certificates on component mount
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

    // Generate report when type or date range changes
    useEffect(() => {
        generateReport();
    }, [selectedType, dateFrom, dateTo]);

    const generateReport = () => {
        let filtered = records.filter((r) => (r.data.certificateType ?? 'MB') === selectedType);

        // Filter by date range
        if (dateFrom || dateTo) {
            filtered = filtered.filter((r) => {
                const certDate = r.data.dateIssued?.split('T')[0]; // Extract date part only
                if (!certDate) return false;
                if (dateFrom && certDate < dateFrom) return false;
                if (dateTo && certDate > dateTo) return false;
                return true;
            });
        }

        // Transform records into report rows with combined container numbers
        const rows: ReportRow[] = filtered.map((record) => {
            const data = record.data;

            // Combine container numbers
            const containers = data.containers ?? [];
            const containerNumbers = containers
                .map((c) => c.cont || '')
                .filter((c) => c)
                .join(', ');

            const sealNumbers = containers
                .map((c) => c.seal || '')
                .filter((s) => s)
                .join(', ');

            return {
                certificateNumber: data.certificateNumber || '',
                dateIssued: data.dateIssued || '',
                containerNumbers,
                sealNumbers,
                exporter: data.exporterName || data.d_name || '',
                consignee: data.consigneeName || data.c_name || '',
                destination: data.destinationCountry || '',
                fumigantName: data.fumigantName || data.f_type || '',
                fumigationStarted: data.fumigationStarted || data.f_date || '',
                fumigationCompleted: data.fumigationCompleted || data.f_date_completed || '',
                rawData: data,
            };
        });

        setReportData(rows);
    };

    const downloadAsCSV = () => {
        if (reportData.length === 0) {
            setStatus('No data to download.');
            return;
        }

        // Flatten all certificate data from rawData
        const allKeys = new Set<string>();
        reportData.forEach((row) => {
            Object.keys(row.rawData).forEach((key) => allKeys.add(key));
        });

        const headers = Array.from(allKeys).sort();
        const csvRows = [headers.map((h) => `"${h}"`).join(',')];

        reportData.forEach((row) => {
            const values = headers.map((header) => {
                const value = (row.rawData as any)[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        const fileName = `${selectedType}_Report_${dateFrom}_to_${dateTo || 'All'}_${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadAsJSON = () => {
        if (reportData.length === 0) {
            setStatus('No data to download.');
            return;
        }

        // Export all raw certificate data
        const jsonData = reportData.map((row) => row.rawData);

        const jsonContent = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        const fileName = `${selectedType}_Report_${dateFrom}_to_${dateTo || 'All'}_${new Date().toISOString().split('T')[0]}.json`;
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const uniqueDates = Array.from(
        new Set(
            records
                .filter((r) => (r.data.certificateType ?? 'MB') === selectedType)
                .map((r) => r.data.dateIssued?.split('T')[0])
                .filter((d) => d)
        )
    ).sort().reverse();

    return (
        <div className="container-fluid">
            <div className="row align-items-center mb-4">
                <div className="col">
                    <p className="text-muted mb-1">Certificates Report</p>
                    <h2 className="mb-0">Certificate Data Report</h2>
                    <p className="text-muted">Select certificate type and date to generate a report.</p>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => (onBack ? onBack() : navigate('/dashboard'))}>
                        Back
                    </button>
                    {onLogout ? (
                        <button type="button" className="btn btn-outline-secondary" onClick={onLogout}>
                            Logout
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Certificate Type Selector */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Report Filters</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Certificate Type</label>
                            <select
                                className="form-select"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value as 'MB' | 'ALP' | 'AUS')}
                            >
                                <option value="MB">MBR Certificates</option>
                                <option value="ALP">ALP Certificates</option>
                                <option value="AUS">AUS Certificates</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Date (Optional)</label>
                            <select
                                className="form-select"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            >
                                <option value="">All Dates</option>
                                {uniqueDates.map((date) => (
                                    <option key={date} value={date}>
                                        {date}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {status && <div className="alert alert-info">{status}</div>}

            {/* Download Buttons */}
            <div className="mb-3">
                <button
                    className="btn btn-success me-2"
                    onClick={downloadAsCSV}
                    disabled={reportData.length === 0}
                >
                    Download as CSV
                </button>
                <button
                    className="btn btn-info"
                    onClick={downloadAsJSON}
                    disabled={reportData.length === 0}
                >
                    Download as JSON
                </button>
            </div>

            {/* Results Summary */}
            {reportData.length > 0 && (
                <div className="alert alert-success">
                    Found <strong>{reportData.length}</strong> certificate(s) for the selected criteria.
                </div>
            )}

            {/* Report Table */}
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Report Data</h5>
                </div>
                <div className="card-body">
                    {isLoading ? (
                        <p>Loading certificates…</p>
                    ) : reportData.length === 0 ? (
                        <p className="text-muted">No certificates found for the selected criteria.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Certificate #</th>
                                        <th>Date Issued</th>
                                        <th>Container Numbers</th>
                                        <th>Seal Numbers</th>
                                        <th>Exporter</th>
                                        <th>Consignee</th>
                                        <th>Destination</th>
                                        <th>Fumigant</th>
                                        <th>Fumigation Dates</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.certificateNumber}</td>
                                            <td>{row.dateIssued?.split('T')[0]}</td>
                                            <td>{row.containerNumbers || '-'}</td>
                                            <td>{row.sealNumbers || '-'}</td>
                                            <td>{row.exporter}</td>
                                            <td>{row.consignee}</td>
                                            <td>{row.destination}</td>
                                            <td>{row.fumigantName}</td>
                                            <td>
                                                {row.fumigationStarted?.split('T')[0]} to{' '}
                                                {row.fumigationCompleted?.split('T')[0]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CertificateReport;
