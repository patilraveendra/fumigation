import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { credentialsMatch, loadLoginConfig } from '../auth/loginConfig';
import './Login.compact.css';

interface LoginProps {
    onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const config = await loadLoginConfig();
            if (!credentialsMatch(config, username, password)) {
                setError('Invalid username or password.');
                return;
            }

            onLogin();
            navigate('/form');
        } catch {
            setError('Could not read login config.json. Check that the file is next to the built site.');
        } finally {
            setIsSubmitting(false);
        }
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
                            <button type="submit" className="primary-button" disabled={isSubmitting}>
                                {isSubmitting ? 'Checking…' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
