import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CertificateForm from './CertificateForm';

const CreateAlpForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialValues = location.state?.initialValues;

    React.useEffect(() => {
        if (!initialValues) {
            navigate('/create/alp', { replace: true });
        }
    }, [initialValues, navigate]);

    if (!initialValues) return null;
    return <CertificateForm initialType="ALP" initialValues={initialValues} />;
};

export default CreateAlpForm;
