import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MbrCertificates from "./pages/MbrCertificates";
import AlpCertificates from "./pages/AlpCertificates";
import CertificateReport from "./pages/CertificateReport";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import NewMbrStart from "./pages/NewMbrStart";
import CreateMbrForm from "./pages/CreateMbrForm";
import PrintCertificate from "./pages/PrintCertificate";
import NewAlpStart from "./pages/NewAlpStart";
import NewAusStart from "./pages/NewAusStart";
import CreateAusForm from "./pages/CreateAusForm";
import AusCertificates from "./pages/AusCertificates";
import Dashboard from "./pages/Dashboard";
import CreateAlpForm from "./pages/CreateAlpForm";
import type { AuthUser } from "./App";

function AppRoutes({
    isAuthenticated,
    authReady,
    authUser,
    onLogin,
    onLogout,
    setIsAuthenticated,
}: {
    isAuthenticated: boolean;
    authReady: boolean;
    authUser: AuthUser | null;
    onLogin: (user: AuthUser) => void;
    onLogout: () => void;
    setIsAuthenticated: (v: boolean) => void;
}) {
    const navigate = useNavigate();
    const handleLogout = () => {
        onLogout();
        navigate('/login', { replace: true });
    };

    if (!authReady) {
        return <div aria-busy="true" />;
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={(user) => onLogin(user)} />} />
            {isAuthenticated && (
                <>
                    <Route
                        path="/dashboard"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <Dashboard />
                            </Layout>
                        }
                    />
                    <Route path="/list" element={<Navigate to="/list/mbr" replace />} />
                    <Route path="/form" element={<Navigate to="/dashboard" replace />} />
                    <Route
                        path="/list/mbr"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <MbrCertificates onLogout={handleLogout} onBack={() => { navigate('/form'); }} authUser={authUser} />
                            </Layout>
                        }
                    />
                    <Route
                        path="/list/alp"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <AlpCertificates onLogout={handleLogout} onBack={() => { navigate('/form'); }} authUser={authUser} />
                            </Layout>
                        }
                    />
                    <Route
                        path="/list/aus"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <AusCertificates onLogout={handleLogout} onBack={() => { navigate('/form'); }} authUser={authUser} />
                            </Layout>
                        }
                    />
                    <Route
                        path="/report"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <CertificateReport onLogout={handleLogout} onBack={() => { navigate('/dashboard'); }} authUser={authUser} />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/mbr"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <NewMbrStart />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/mbr/form"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <CreateMbrForm onLogout={handleLogout} />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/alp"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <NewAlpStart />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/aus"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <NewAusStart />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/alp/form"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <CreateAlpForm onLogout={handleLogout} />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/aus/form"
                        element={
                            <Layout onLogout={handleLogout} authUser={authUser}>
                                <CreateAusForm onLogout={handleLogout} />
                            </Layout>
                        }
                    />
                </>
            )}
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/form" element={<Navigate to="/login" replace />} />
            <Route path="/list/*" element={<Navigate to="/login" replace />} />
            <Route path="/create/*" element={<Navigate to="/login" replace />} />
            <Route path="/report" element={<Navigate to="/login" replace />} />
            <Route path="/print" element={<PrintCertificate />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
