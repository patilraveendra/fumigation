import React from 'react';
import SavedCertificates from './SavedCertificates';

const AusCertificates: React.FC<{ onBack?: () => void; onLogout?: () => void }> = ({ onBack, onLogout }) => {
    return <SavedCertificates onBack={() => onBack?.()} onLogout={() => onLogout?.()} initialType="AUS" />;
};

export default AusCertificates;
