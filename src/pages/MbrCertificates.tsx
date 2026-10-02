import React from 'react';
import SavedCertificates from './SavedCertificates';
import type { AuthUser } from '../App';

const MbrCertificates: React.FC<{ onBack?: () => void; onLogout?: () => void; authUser?: AuthUser | null }> = ({ onBack, onLogout, authUser }) => {
    return <SavedCertificates onBack={() => onBack?.()} onLogout={() => onLogout?.()} initialType="MB" authUser={authUser} />;
};

export default MbrCertificates;
