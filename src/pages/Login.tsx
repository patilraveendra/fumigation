import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <div className="row justify-content-center w-100">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-dark text-white text-center">
                            <div className="small text-muted">ADMIN LOGIN</div>
                            <h4 className="mb-0">Fumigation Certificate Portal</h4>
                            <div className="text-muted small">Enter your admin credentials to continue.</div>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                                </div>

                                {error ? <div className="alert alert-danger">{error}</div> : null}

                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-danger">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
