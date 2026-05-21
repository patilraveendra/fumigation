import { useState, type FormEvent } from 'react';

interface LoginProps {
    onLogin: () => void;
}

const validUsername = 'admin';
const validPassword = 'Infotech@1';

function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (username.trim() === validUsername && password === validPassword) {
            setError(null);
            onLogin();
            return;
        }

        setError('Invalid username or password.');
    };

    return (
        <div className="page-shell">
            <header className="page-header">
                <div>
                    <p className="eyebrow">Admin Login</p>
                    <h1>Fumigation Certificate Portal</h1>
                    <p>Enter your admin credentials to continue.</p>
                </div>
            </header>

            <form className="certificate-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <label className="field-item">
                        <span>Username</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                        />
                    </label>
                    <label className="field-item">
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                        />
                    </label>
                </div>

                {error ? <div className="form-status"><p>{error}</p></div> : null}

                <div className="form-actions">
                    <button type="submit" className="primary-button">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
