import React from 'react';
import CertificateForm from './CertificateForm';
import { useNavigate } from 'react-router-dom';

const CreateMbr: React.FC = () => {
    const navigate = useNavigate();
    return (
        <CertificateForm
            initialType="MB"
            onViewSaved={() => navigate('/list/mbr')}
            onLogout={() => navigate('/')}
        />
    );
};

export default CreateMbr;
