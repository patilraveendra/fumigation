import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold text-danger">PEST & SOLUTIONS PVT. LTD.</h1>
                <p className="lead text-muted">Fumigation & Pest Control Application Software</p>
            </div>

            <div className="row justify-content-center g-4">
                <div className="col-12 col-sm-6 col-md-4 d-flex">
                    <div className="card text-white w-100" style={{ background: '#ff4c2b', cursor: 'pointer' }} onClick={() => navigate('/login?type=fumigation')}>
                        <div className="card-body d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 220 }}>
                            <div style={{ fontSize: 60 }}>🧑‍🌾</div>
                            <h4 className="mt-3">FUMIGATION</h4>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4 d-flex">
                    <div className="card text-white w-100" style={{ background: '#29a6e3', cursor: 'pointer' }} onClick={() => navigate('/login?type=pestcontrol')}>
                        <div className="card-body d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 220 }}>
                            <div style={{ fontSize: 60 }}>🧑‍🔬</div>
                            <h4 className="mt-3">PEST CONTROL</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-muted mt-5">
                <p className="mb-1">Note: Fumigation & Pest Control Software now work individually. Username & Password remain the same for both.</p>
                <p>If you need help please mail on jayesh@bloomtechnolab.com</p>
            </div>
        </div>
    );
};

export default Home;
