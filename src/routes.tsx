import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CertificateForm from "./pages/CertificateForm";
import SavedCertificates from "./pages/SavedCertificates";
import MbrCertificates from "./pages/MbrCertificates";
import AlpCertificates from "./pages/AlpCertificates";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import CreateMbr from "./pages/CreateMbr";
import NewMbrStart from "./pages/NewMbrStart";
import CreateAlp from "./pages/CreateAlp";
import CreateAlpForm from "./pages/CreateAlpForm";
import AlpDashboard from "./pages/AlpDashboard";
import CreateMbrForm from "./pages/CreateMbrForm";
import PrintCertificate from "./pages/PrintCertificate";
import NewAlpStart from "./pages/NewAlpStart";
import Dashboard from "./pages/Dashboard";

function AppRoutes({ isAuthenticated, setIsAuthenticated }: { isAuthenticated: boolean; setIsAuthenticated: (v: boolean) => void }) {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            {isAuthenticated && (
                <>
                    <Route
                        path="/dashboard"
                        element={
                            <Layout onLogout={() => { setIsAuthenticated(false); navigate('/'); }}>
                                <Dashboard />
                            </Layout>
                        }
                    />
                    <Route path="/list" element={<Navigate to="/list/mbr" replace />} />
                    <Route path="/form" element={<Navigate to="/dashboard" replace />} />
                    <Route
                        path="/list/mbr"
                        element={
                            <Layout onLogout={() => { setIsAuthenticated(false); navigate('/'); }}>
                                <MbrCertificates onLogout={() => { setIsAuthenticated(false); navigate('/'); }} onBack={() => { navigate('/form'); }} />
                            </Layout>
                        }
                    />
                    <Route
                        path="/list/alp"
                        element={
                            <Layout onLogout={() => { setIsAuthenticated(false); navigate('/'); }}>
                                <AlpCertificates onLogout={() => { setIsAuthenticated(false); navigate('/'); }} onBack={() => { navigate('/form'); }} />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/mbr"
                        element={
                            <Layout onLogout={() => { setIsAuthenticated(false); navigate('/'); }}>
                                <NewMbrStart />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/mbr/form"
                        element={
                            <Layout onLogout={() => { setIsAuthenticated(false); navigate('/'); }}>
                                <CreateMbrForm />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/alp"
                        element={
                            <Layout onLogout={() => { setIsAuthenticated(false); navigate('/'); }}>
                                <NewAlpStart />
                            </Layout>
                        }
                    />
                    <Route
                        path="/create/alp/form"
                        element={
                            <Layout onLogout={() => { setIsAuthenticated(false); navigate('/'); }}>
                                <CreateAlpForm />
                            </Layout>
                        }
                    />
                </>
            )}
            <Route path="/print" element={<PrintCertificate />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
