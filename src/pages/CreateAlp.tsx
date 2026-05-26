import React from 'react';
import CertificateForm from './CertificateForm';
import { useNavigate } from 'react-router-dom';

const CreateAlp: React.FC = () => {
    const navigate = useNavigate();
    return (
        <CertificateForm
            initialType="ALP"
            onViewSaved={() => navigate('/list/alp')}
            onLogout={() => navigate('/')}
        />
    );
};

export default CreateAlp;
