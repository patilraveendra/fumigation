import React from 'react';
import SavedCertificates from './SavedCertificates';

const MbrCertificates: React.FC<{ onBack?: () => void; onLogout?: () => void }> = ({ onBack, onLogout }) => {
    return <SavedCertificates onBack={() => onBack?.()} onLogout={() => onLogout?.()} initialType="MB" />;
};

export default MbrCertificates;
