import React from 'react';
import SavedCertificates from './SavedCertificates';

const AlpCertificates: React.FC<{ onBack?: () => void; onLogout?: () => void }> = ({ onBack, onLogout }) => {
    return <SavedCertificates onBack={() => onBack?.()} onLogout={() => onLogout?.()} initialType="ALP" />;
};

export default AlpCertificates;
