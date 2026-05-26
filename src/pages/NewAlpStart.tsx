import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DPPQS_REGISTRATIONS } from '../constants/mbrConstants';

const NewAlpStart: React.FC = () => {
    const navigate = useNavigate();
    const [registration, setRegistration] = useState('');
    const [date, setDate] = useState('');
    const [certificateNo, setCertificateNo] = useState('');
    const [noOfQuantity, setNoOfQuantity] = useState('');
    const [detail, setDetail] = useState('');

    function handleStart() {
        navigate('/create/alp/form', {
            state: {
                initialValues: {
                    providerId: registration,
                    dateIssued: date,
                    certificateNumber: certificateNo,
                    noOfQuantity,
                    detail,
                    certificateType: 'ALP',
                },
            },
        });
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4" style={{ color: '#3399cc' }}>ALP Certificate <span style={{ fontWeight: 400, fontSize: 24, color: '#666' }}>»New ALP</span></h2>
            <div className="card p-4 mb-4">
                <div className="row mb-3 align-items-center">
                    <div className="col-md-3 fw-bold">* DPPQS Registration No :</div>
                    <div className="col-md-9">
                        <select className="form-select" value={registration} onChange={e => setRegistration(e.target.value)}>
                            <option value="">Select DPPQS Registration</option>
                            {DPPQS_REGISTRATIONS.map((reg) => (
                                <option key={reg.value} value={reg.value}>{reg.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3 align-items-center">
                    <div className="col-md-3 fw-bold">* Date Of Certificate :</div>
                    <div className="col-md-9">
                        <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                </div>
                <div className="row mb-3 align-items-center">
                    <div className="col-md-3 fw-bold">* Certificate No. :</div>
                    <div className="col-md-6">
                        <input type="text" className="form-control" value={certificateNo} onChange={e => setCertificateNo(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-check-label ms-2">
                            <input type="checkbox" className="form-check-input me-2" disabled />Autogenerate Certificate Number On LOCK
                        </label>
                    </div>
                </div>
                <div className="row mb-3 align-items-center">
                    <div className="col-md-3 fw-bold">Work Order :</div>
                    <div className="col-md-9">-</div>
                </div>
                <div className="row mb-3 align-items-center">
                    <div className="col-md-3 fw-bold">No Of Quantity:</div>
                    <div className="col-md-9">
                        <input type="text" className="form-control" value={noOfQuantity} onChange={e => setNoOfQuantity(e.target.value)} />
                    </div>
                </div>
                <div className="row mb-3 align-items-center">
                    <div className="col-md-3 fw-bold">Detail</div>
                    <div className="col-md-9">
                        <input type="text" className="form-control" value={detail} onChange={e => setDetail(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-end">
                        <button className="btn btn-primary" onClick={handleStart} disabled={!registration || !date || !certificateNo}>Start</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewAlpStart;
