import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CertificateForm from './CertificateForm';

const CreateMbrForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = (location.state as any) || {};
    const initialValues = state.initialValues ?? undefined;

    return (
        <CertificateForm
            initialType="MB"
            initialValues={initialValues}
            onViewSaved={() => navigate('/list/mbr')}
            onLogout={() => navigate('/')}
        />
    );
};

export default CreateMbrForm;
