import React from "react";
import { useNavigate } from "react-router-dom";

const BrandMark = () => (
    <svg viewBox="0 0 48 48" className="brand-mark" aria-hidden="true">
        <defs>
            <linearGradient id="brandShield" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4dbb73" />
                <stop offset="100%" stopColor="#2e8e57" />
            </linearGradient>
        </defs>
        <path d="M24 4 39 10v11c0 10.4-6.4 18.5-15 22-8.6-3.5-15-11.6-15-22V10L24 4Z" fill="none" stroke="url(#brandShield)" strokeWidth="2.5" />
        <path d="M24 13c4.7 0 8.5 3.8 8.5 8.5 0 5.4-3.7 9.8-8.5 12.6-4.8-2.8-8.5-7.2-8.5-12.6C15.5 16.8 19.3 13 24 13Z" fill="#e9f8ee" />
        <path d="M24 15v17M16.5 23.5H31.5M19 18.5l10 10M29 18.5l-10 10" stroke="#2e8e57" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const ComplianceIcon = () => (
    <svg viewBox="0 0 24 24" className="inline-icon" aria-hidden="true">
        <path d="M12 3 19 6v5c0 4.3-2.6 7.7-7 9.5C7.6 18.7 5 15.3 5 11V6l7-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="m9.2 11.9 1.8 1.8 3.8-4.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ContainerIcon = () => (
    <svg viewBox="0 0 64 64" className="service-svg" aria-hidden="true">
        <rect x="12" y="21" width="40" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M18 21v28M24 21v28M31 21v28M38 21v28M45 21v28" stroke="currentColor" strokeWidth="2.5" />
        <path d="M32 12c4.7 0 8 3.4 8 7.8-4.5 0-8-3.2-8-7.8Zm0 0c-4.7 0-8 3.4-8 7.8 4.5 0 8-3.2 8-7.8Z" fill="currentColor" opacity="0.9" />
    </svg>
);

const PestIcon = () => (
    <svg viewBox="0 0 64 64" className="service-svg" aria-hidden="true">
        <path d="M32 9 49 16v12c0 12-7.2 21.2-17 25-9.8-3.8-17-13-17-25V16L32 9Z" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="32" cy="31" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M32 18v7M22 25l5 3M42 25l-5 3M22 38l5-3M42 38l-5-3M27 43l2.5-5M37 43l-2.5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const FeatureIcon = ({ children }: { children: React.ReactNode }) => <span className="feature-icon-wrap">{children}</span>;

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page home-screen">

            <div className="home-topbar">
                <div className="home-topbar-inner container">
                    <button
                        type="button"
                        className="home-brand"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="logo.png"
                            alt="PAS"
                            className="brand-logo"
                        />

                        <span className="brand-copy">
                            <strong>PAS</strong>
                            <span>Pest Analysis Services</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        className="home-login-btn"
                        onClick={() => navigate('/login')}
                    >
                        <span className="login-lock">🔒</span>
                        Staff Login
                    </button>
                </div>
            </div>

            <section className="home-stage">
                <div className="home-backdrop" aria-hidden="true">
                    <div className="backdrop-left" />
                    <div className="backdrop-right" />
                    <div className="backdrop-leaf leaf-top" />
                    <div className="backdrop-leaf leaf-bottom" />
                </div>

                <div className="home-center container">
                    <div className="home-copy">
                        <div className="home-kicker">
                            <ComplianceIcon />
                            CERTIFIED. COMPLIANT. TRUSTED.
                        </div>
                        <h1 className="home-main-title">
                            Container Fumigation
                            <span>Management System</span>
                        </h1>
                        <p className="home-main-subtitle">
                            Manage fumigation procedures, pest control operations and
                            certificates with ease and compliance.
                        </p>
                    </div>

                    <div className="home-card-grid">
                        <article className="module-card fumigation-card">
                            <div className="module-icon module-green">
                                <ContainerIcon />
                            </div>
                            <h2>Fumigation</h2>
                            <p>Manage container fumigation, treatments, and generate MB certificates.</p>
                            <button type="button" className="module-button button-green" onClick={() => navigate('/login?type=fumigation')}>
                                <span>Access Fumigation Module</span>
                                <span aria-hidden="true">→</span>
                            </button>
                        </article>

                        <article className="module-card pest-card">
                            <div className="module-icon module-blue">
                                <PestIcon />
                            </div>
                            <h2>Pest Control</h2>
                            <p>Manage pest control operations, inspections, and treatment records.</p>
                            <button type="button" className="module-button button-blue" onClick={() => navigate('/login?type=pestcontrol')}>
                                <span>Access Pest Control Module</span>
                                <span aria-hidden="true">→</span>
                            </button>
                        </article>
                    </div>

                    <div className="home-features-bar">
                        <div className="home-feature-item">
                            <FeatureIcon>✅</FeatureIcon>
                            <div>
                                <strong>100% Compliant</strong>
                                <span>ISPM 15 &amp; Local Standards</span>
                            </div>
                        </div>
                        <div className="home-feature-item">
                            <FeatureIcon>📄</FeatureIcon>
                            <div>
                                <strong>Digital Certificates</strong>
                                <span>Secure &amp; Verifiable</span>
                            </div>
                        </div>
                        <div className="home-feature-item">
                            <FeatureIcon>☁️</FeatureIcon>
                            <div>
                                <strong>Cloud Based</strong>
                                <span>Access Anywhere</span>
                            </div>
                        </div>
                        <div className="home-feature-item">
                            <FeatureIcon>🔐</FeatureIcon>
                            <div>
                                <strong>Secure &amp; Reliable</strong>
                                <span>Your Data is Protected</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
