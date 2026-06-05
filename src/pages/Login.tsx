import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.compact.css';

interface LoginProps {
    onLogin: () => void;
}

const validUsername = 'admin';
const validPassword = 'Infotech@1';


function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (username.trim() === validUsername && password === validPassword) {
            setError(null);
            onLogin();
            // Redirect to /form after login
            navigate('/form');
            return;
        }

        setError('Invalid username or password.');
    };

    return (
        <div className="page-shell">
            <div className="login-card">
                <div className="login-header">
                    <div className="eyebrow">ADMIN LOGIN</div>
                    <div className="login-title">Fumigation Certificate Portal</div>
                    <div className="login-desc">Enter your admin credentials to continue.</div>
                </div>

                <div className="certificate-form">
                    <form onSubmit={handleSubmit} className="form-section">
                        <div className="field-item">
                            <span>Username</span>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
                        </div>

                        <div className="field-item">
                            <span>Password</span>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                        </div>

                        {error ? (
                            <div className="form-status">
                                <p>{error}</p>
                            </div>
                        ) : null}

                        <div className="form-actions">
                            <button type="submit" className="primary-button">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
