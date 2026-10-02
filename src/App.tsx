import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

export type AuthUser = {
    username: string;
    role: 'admin' | 'staff' | 'operator';
};

const STORAGE_KEY = 'fumigation-auth-user';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        try {
            const parsed = JSON.parse(stored) as Partial<AuthUser>;
            if (parsed.username && parsed.role) {
                setAuthUser({ username: parsed.username, role: parsed.role as AuthUser['role'] });
                setIsAuthenticated(true);
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const handleLogin = (user: AuthUser) => {
        setAuthUser(user);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    };

    const handleLogout = () => {
        setAuthUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <Router>
            <AppRoutes
                isAuthenticated={isAuthenticated}
                authUser={authUser}
                onLogin={handleLogin}
                onLogout={handleLogout}
                setIsAuthenticated={setIsAuthenticated}
            />
        </Router>
    );
}

export default App;
