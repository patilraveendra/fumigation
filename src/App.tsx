import './App.css';
import { useState } from 'react';
import CertificateForm from './pages/CertificateForm';
import Login from './pages/Login';
import SavedCertificates from './pages/SavedCertificates';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activePage, setActivePage] = useState<'form' | 'list'>('form');

    if (!isAuthenticated) {
        return <Login onLogin={() => setIsAuthenticated(true)} />;
    }

    return activePage === 'form' ? (
        <CertificateForm
            onLogout={() => setIsAuthenticated(false)}
            onViewSaved={() => setActivePage('list')}
        />
    ) : (
        <SavedCertificates
            onLogout={() => setIsAuthenticated(false)}
            onBack={() => setActivePage('form')}
        />
    );
}

export default App;
