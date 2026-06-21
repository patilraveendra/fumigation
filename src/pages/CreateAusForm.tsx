import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CertificateForm from './CertificateForm';

const CreateAusForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialValues = location.state?.initialValues;

    React.useEffect(() => {
        if (!initialValues) {
            navigate('/create/aus', { replace: true });
        }
    }, [initialValues, navigate]);

    if (!initialValues) return null;
    return <CertificateForm initialType="AUS" initialValues={initialValues} />;
};

export default CreateAusForm;
