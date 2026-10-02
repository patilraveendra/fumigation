import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCertificateSummary, type CertificateSummary } from '../api/apiService';

const InlineSkeleton = ({ width = 80 }: { width?: number }) => (
    <div className="skeleton-inline" style={{ width }} />
);

const Dashboard: React.FC = () => {
    const [summary, setSummary] = useState<CertificateSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const s = await fetchCertificateSummary();
            setSummary(s);
        } catch (e) {
            console.error(e);
            setError('Unable to load certificate summary.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    // compact card helper
    const Card = ({ title, value, accent, onView }: { title: string; value: number | null | undefined; accent?: string; onView: () => void }) => (
        <div className="summary-card" role="group" aria-label={title}>
            <div className="summary-card-header">
                <div className="summary-card-title" style={{ color: accent }}>{title}</div>
            </div>
            <div className="summary-card-body">
                <div className="count-number">{loading ? <InlineSkeleton width={90} /> : (value == null ? '—' : <span>{value}</span>)}</div>
                <div className="count-sub">certificates</div>
            </div>
            <div className="summary-card-footer">
                <button className="text-link" onClick={onView}>View certificates →</button>
            </div>
        </div>
    );

    return (
        <div className="page-shell">
            <div className="content" style={{ maxWidth: 1280, margin: '32px auto', padding: '0 18px' }}>
                <header style={{ marginBottom: 20 }}>
                    <h1 style={{ margin: 0 }}>Dashboard</h1>
                    <p className="muted" style={{ margin: '6px 0 0 0' }}>Quick overview of your certificate operations.</p>
                </header>

                <section style={{ marginTop: 24 }}>
                    <div className="section-label">CERTIFICATE SUMMARY</div>
                    {error && !loading && (
                        <div style={{ margin: '10px 0 14px 0', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div>Unable to load certificate summary.</div>
                            <button className="secondary-button--compact" onClick={load}>Retry</button>
                        </div>
                    )}

                    <div className="summary-grid">
                        <Card title="MBR Certificates" value={summary?.mbr} accent="#2f8b3a" onView={() => navigate('/list/mbr')} />
                        <Card title="ALP Certificates" value={summary?.alp} accent="#2b6ef6" onView={() => navigate('/list/alp')} />
                        <Card title="AUS Certificates" value={summary?.aus} accent="#c47f1a" onView={() => navigate('/list/aus')} />
                    </div>
                </section>

                <section style={{ marginTop: 28 }}>
                    <div className="section-label">TOTAL CERTIFICATES</div>
                    <div className="total-row">
                        <div className="total-number">{loading ? <InlineSkeleton width={60} /> : (error ? '—' : (summary?.total ?? 0))}</div>
                        <div className="total-sub muted">certificates</div>
                    </div>
                </section>

                <section style={{ marginTop: 28 }}>
                    <div className="section-label">QUICK ACTIONS</div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button className="primary-button--compact" onClick={() => navigate('/create/mbr')}>+ Create MBR Certificate</button>
                        <button className="primary-button--compact" onClick={() => navigate('/create/alp')}>+ Create ALP Certificate</button>
                        <button className="primary-button--compact" onClick={() => navigate('/create/aus')}>+ Create AUS Certificate</button>
                        <button className="secondary-button--compact" onClick={() => navigate('/report')}>View Reports</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
