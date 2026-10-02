import React, { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import type { AuthUser } from '../App';

const certificateFormLinks = [
    { label: 'Create MBR Certificate', to: '/create/mbr' },
    { label: 'Create ALP Certificate', to: '/create/alp' },
    { label: 'Create AUS Certificate', to: '/create/aus' },
];

const savedCertificatesLinks = [
    { label: 'MBR Certificates', to: '/list/mbr' },
    { label: 'ALP Certificates', to: '/list/alp' },
    { label: 'AUS Certificates', to: '/list/aus' },
];

const Layout: React.FC<{ children: React.ReactNode; onLogout?: () => void; authUser?: AuthUser | null }> = ({ children, onLogout, authUser }) => {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState<'form' | 'saved' | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isFormGroupActive = useMemo(
        () => location.pathname.startsWith('/create/') || location.pathname === '/form',
        [location.pathname],
    );

    const isSavedGroupActive = useMemo(
        () => location.pathname.startsWith('/list/'),
        [location.pathname],
    );

    const isReportsActive = location.pathname === '/report';

    const renderDropdown = (menu: 'form' | 'saved', items: Array<{ label: string; to: string }>, title: string) => {
        const isActive = menu === 'form' ? isFormGroupActive : isSavedGroupActive;
        const isOpen = openMenu === menu;

        return (
            <div className="nav-dropdown" key={menu}>
                <button
                    type="button"
                    className={`nav-dropdown__trigger ${isActive ? 'is-active' : ''}`}
                    onClick={() => setOpenMenu((prev) => (prev === menu ? null : menu))}
                    aria-expanded={isOpen}
                >
                    <span>{title}</span>
                    <span className="nav-dropdown__caret">▾</span>
                </button>

                {isOpen ? (
                    <div className="nav-dropdown__menu" role="menu" aria-label={title}>
                        {items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={false}
                                className={({ isActive: itemIsActive }) => `nav-dropdown__item ${itemIsActive ? 'is-active' : ''}`}
                                onClick={() => setOpenMenu(null)}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    };

    return (
        <div className="admin-shell">
            <header className="top-nav">
                <div className="top-nav__left">
                    <div className="brand-mark" aria-label="Pest & Solutions brand">
                        <div className="brand-mark__logo">P</div>
                        <div className="brand-mark__text">
                            <span className="brand-mark__name">Pest &amp; Solutions</span>
                            <small>Fumigation</small>
                        </div>
                    </div>
                </div>

                <div className="top-nav__mobile-actions">
                    <button
                        type="button"
                        className="mobile-menu-toggle"
                        aria-label="Toggle navigation"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                    >
                        ☰
                    </button>
                </div>

                <nav className={`top-nav__center ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
                    {renderDropdown('form', certificateFormLinks, 'Certificate Form')}
                    {renderDropdown('saved', savedCertificatesLinks, 'Saved Certificates')}

                    <NavLink
                        to="/report"
                        className={({ isActive }) => `top-nav__link ${isActive || isReportsActive ? 'is-active' : ''}`}
                        onClick={() => setOpenMenu(null)}
                    >
                        Reports
                    </NavLink>
                </nav>

                <div className="top-nav__right">
                    <div className="user-pill" aria-label="Current user">
                        <span className="user-pill__avatar">{(authUser?.username ?? 'A').charAt(0).toUpperCase()}</span>
                        <span className="user-pill__meta">
                            <strong>{authUser?.username ?? 'admin'}</strong>
                            <small>{authUser?.role ?? 'admin'}</small>
                        </span>
                    </div>
                    {onLogout ? (
                        <button type="button" className="primary-action tiny" onClick={onLogout}>Logout</button>
                    ) : (
                        <Link to="/" className="primary-action tiny">Logout</Link>
                    )}
                </div>
            </header>

            <main className="admin-main">
                <div className="admin-page">{children}</div>
            </main>
        </div>
    );
};

export default Layout;
