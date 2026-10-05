import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AUSCertificateForm from './AUSCertificateForm';

const CreateAusForm: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialValues = location.state?.initialValues;

    React.useEffect(() => {
        if (!initialValues) {
            navigate('/create/aus', { replace: true });
        }
    }, [initialValues, navigate]);

    if (!initialValues) return null;
    return <AUSCertificateForm initialType="AUS" initialValues={initialValues} onLogout={onLogout} />;
};

export default CreateAusForm;
