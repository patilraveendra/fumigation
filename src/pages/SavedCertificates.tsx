import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCertificates, type CertificateRecord } from '../api/apiService';
import { pingApi } from '../api/apiService';
import { type CertificateData } from '../types/certificate';
import './CertificateForm.compact.css';

interface SavedCertificatesProps {
    onBack: () => void;
    onLogout?: () => void;
    initialType?: 'MB' | 'ALP';
}

function getPartyName(data: Partial<CertificateData>) {
    return data.consigneeName || data.exporterName || data.clientName || 'Unknown party';
}

function SavedCertificates({ onBack, onLogout, initialType }: SavedCertificatesProps) {
    const [records, setRecords] = useState<CertificateRecord[]>([]);
    const [selectedRecordId, setSelectedRecordId] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<'MB' | 'ALP'>(initialType ?? 'MB');

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
    const filteredRecords = records.filter((r) => (r.data.certificateType ?? 'MB') === selectedType);
    const navigate = useNavigate();

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
                                                <tr key={record.id}>
                                                    <td>{record.data.certificateNumber ?? '—'}</td>
                                                    <td>{record.data.dateIssued ? new Date(record.data.dateIssued).toLocaleDateString() : '—'}</td>
                                                    <td>{getPartyName(record.data)}</td>
                                                    <td>{record.data.certificateType ?? '—'}</td>
                                                    <td>
                                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelectedRecordId(record.id)}>View</button>
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

                <div className="col-lg-4">
                    {selectedRecord ? (
                        <div className="card">
                            <div className="card-header">Certificate details</div>
                            <div className="card-body">
                                <div className="mb-2"><strong>Certificate Number:</strong> {selectedRecord.data.certificateNumber ?? '—'}</div>
                                <div className="mb-2"><strong>Date Issued:</strong> {selectedRecord.data.dateIssued ?? '—'}</div>
                                <div className="mb-2"><strong>Date of Fumigation:</strong> {selectedRecord.data.fumigationStarted ?? '—'}</div>
                                <div className="mb-2"><strong>Fumigator Name:</strong> {selectedRecord.data.fumigatorName ?? '—'}</div>
                                <div className="mb-2"><strong>Certificate Type:</strong> {selectedRecord.data.certificateType ?? '—'}</div>
                                <div className="mb-2"><strong>Party Name:</strong> {getPartyName(selectedRecord.data)}</div>
                                <div className="mb-2"><strong>Exporter:</strong> {selectedRecord.data.exporterName ?? '—'}</div>
                                <div className="mb-2"><strong>Consignee:</strong> {selectedRecord.data.consigneeName ?? '—'}</div>
                                <div className="mb-2"><strong>Fumigant:</strong> {selectedRecord.data.fumigantName ?? '—'}</div>
                                <div className="mb-2"><strong>Place:</strong> {selectedRecord.data.placeOfFumigation ?? '—'}</div>
                                <div className="mb-2"><strong>Dose Rate:</strong> {selectedRecord.data.doseRate ?? '—'}</div>
                                <div className="mb-2"><strong>Duration:</strong> {selectedRecord.data.durationFumigation ?? '—'}</div>
                                <div className="mb-2"><strong>Temperature:</strong> {selectedRecord.data.temperature ?? '—'}</div>
                                <div className="mb-2"><strong>Humidity:</strong> {selectedRecord.data.humidity ?? '—'}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-body text-muted">Select a certificate to view details here.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SavedCertificates;
