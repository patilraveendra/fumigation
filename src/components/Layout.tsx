import React from 'react';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode; onLogout?: () => void }> = ({ children, onLogout }) => (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6fa' }}>
        {/* Sidebar */}
        <nav className="sidebar bg-dark text-light d-flex flex-column p-3" style={{ width: 220 }}>
            <div className="mb-4 d-flex align-items-center gap-2">
                <img src="/logo.png" alt="PAS" className="sidebar-logo" />
                <div>
                    <div className="fs-6 fw-bold">Pest & Solutions</div>
                    <div className="small text-light-50">Fumigation</div>
                </div>
            </div>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/form" className="nav-link text-light">
                        <i className="bi bi-file-earmark-text me-2" /> Certificate Form
                    </Link>
                    <ul className="nav flex-column ms-2">
                        <li className="nav-item">
                            <Link to="/create/mbr" className="nav-link text-light small">Create MBR Certificate</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/create/alp" className="nav-link text-light small">Create ALP Certificate</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <div className="nav-link text-light">Saved Certificates</div>
                    <ul className="nav flex-column ms-2">
                        <li className="nav-item">
                            <Link to="/list/mbr" className="nav-link text-light small">MBR Certificates</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/list/alp" className="nav-link text-light small">ALP Certificates</Link>
                        </li>
                    </ul>
                </li>
            </ul>
            <hr />
            <div className="mt-auto small text-light-50">&copy; {new Date().getFullYear()} Pest & Solutions</div>
        </nav>
        {/* Main content */}
        <div className="flex-grow-1 d-flex flex-column">
            {/* Topbar */}
            <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm px-4" style={{ minHeight: 56 }}>
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <img src="/logo.png" alt="PAS" className="topbar-logo me-2" />
                        <span className="navbar-brand mb-0 h6 text-white">Fumigation & Pest Control</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="me-3 text-light small">admin</span>
                        {onLogout ? (
                            <button type="button" className="btn btn-outline-light btn-sm" onClick={onLogout}>
                                Logout
                            </button>
                        ) : (
                            <Link to="/" className="btn btn-outline-light btn-sm">Logout</Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-grow-1 py-4" style={{ minHeight: 0 }}>
                <div className="container">
                    <div className="content-card p-4 shadow-sm bg-white rounded">{children}</div>
                </div>
            </main>
        </div>
    </div>
);

export default Layout;
