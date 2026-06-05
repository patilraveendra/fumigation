import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DPPQS_REGISTRATIONS } from '../constants/mbrConstants';

const NewMbrStart: React.FC = () => {
    const navigate = useNavigate();
    const [registration, setRegistration] = useState('');
    const [date, setDate] = useState('');
    const [certNumber, setCertNumber] = useState('');

    const handleContinue = () => {
        const initialValues = {
            providerId: registration,
            dateIssued: date,
            certificateNumber: certNumber,
        };
        navigate('/create/mbr/form', { state: { initialValues } });
    };

    return (
        <div>
            <h3 className="mb-3">New MBR Certificate</h3>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="mb-3 row align-items-center">
                        <label className="col-sm-3 col-form-label">DPPQS Registration No</label>
                        <div className="col-sm-6">
                            <select className="form-select" value={registration} onChange={(e) => setRegistration(e.target.value)}>
                                <option value="">Select DPPQS Registration</option>
                                {DPPQS_REGISTRATIONS.map((r) => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3 row align-items-center">
                        <label className="col-sm-3 col-form-label">Date Of Certificate</label>
                        <div className="col-sm-6">
                            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="mb-3 row align-items-center">
                        <label className="col-sm-3 col-form-label">Certificate No.</label>
                        <div className="col-sm-6">
                            <input className="form-control" value={certNumber} onChange={(e) => setCertNumber(e.target.value)} />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleContinue}>Continue</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewMbrStart;
