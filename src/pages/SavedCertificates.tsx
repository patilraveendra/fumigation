import { useEffect, useState } from 'react';
import { fetchCertificates, type CertificateRecord } from '../api/apiService';
import { type CertificateData } from '../types/certificate';

interface SavedCertificatesProps {
    onBack: () => void;
    onLogout?: () => void;
}

function getPartyName(data: Partial<CertificateData>) {
    return data.consigneeName || data.exporterName || data.clientName || 'Unknown party';
}

function SavedCertificates({ onBack, onLogout }: SavedCertificatesProps) {
    const [records, setRecords] = useState<CertificateRecord[]>([]);
    const [selectedRecordId, setSelectedRecordId] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const selectedRecord = records.find((record) => record.id === selectedRecordId);

    return (
        <div className="page-shell">
            <header className="page-header">
                <div>
                    <p className="eyebrow">Saved Certificates</p>
                    <h1>Saved Fumigation Certificates</h1>
                    <p>Select a certificate from the table below to view its details.</p>
                </div>
                <div>
                    <button type="button" className="secondary-button" onClick={onBack}>
                        Back to create
                    </button>
                    {onLogout ? (
                        <button type="button" className="secondary-button" onClick={onLogout}>
                            Logout
                        </button>
                    ) : null}
                </div>
            </header>

            <section className="form-section">
                <div className="field-grid field-grid-two">
                    <div>
                        <h2>Certificate list</h2>
                        {isLoading ? <p>Loading certificates…</p> : null}
                        {status ? <div className="form-status"><p>{status}</p></div> : null}
                    </div>
                </div>

                <div className="table-container">
                    <table>
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
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>No certificates found.</td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.data.certificateNumber ?? '—'}</td>
                                        <td>{record.data.dateIssued ? new Date(record.data.dateIssued).toLocaleDateString() : '—'}</td>
                                        <td>{getPartyName(record.data)}</td>
                                        <td>{record.data.certificateType ?? '—'}</td>
                                        <td>
                                            <button type="button" className="secondary-button" onClick={() => setSelectedRecordId(record.id)}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {selectedRecord ? (
                <section className="form-section">
                    <h2>Certificate details</h2>
                    <div className="field-grid field-grid-two">
                        <div className="field-item">
                            <span>Certificate Number</span>
                            <p>{selectedRecord.data.certificateNumber ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Date Issued</span>
                            <p>{selectedRecord.data.dateIssued ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Date of Fumigation</span>
                            <p>{selectedRecord.data.fumigationStarted ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Fumigator Name</span>
                            <p>{selectedRecord.data.fumigatorName ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Certificate Type</span>
                            <p>{selectedRecord.data.certificateType ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Party Name</span>
                            <p>{getPartyName(selectedRecord.data)}</p>
                        </div>
                        <div className="field-item">
                            <span>Exporter Name</span>
                            <p>{selectedRecord.data.exporterName ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Consignee Name</span>
                            <p>{selectedRecord.data.consigneeName ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Fumigant Name</span>
                            <p>{selectedRecord.data.fumigantName ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Place of Fumigation</span>
                            <p>{selectedRecord.data.placeOfFumigation ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Dose Rate</span>
                            <p>{selectedRecord.data.doseRate ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Duration of Fumigation</span>
                            <p>{selectedRecord.data.durationFumigation ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Temperature</span>
                            <p>{selectedRecord.data.temperature ?? '—'}</p>
                        </div>
                        <div className="field-item">
                            <span>Humidity</span>
                            <p>{selectedRecord.data.humidity ?? '—'}</p>
                        </div>
                    </div>
                </section>
            ) : null}
        </div>
    );
}

export default SavedCertificates;
