import React, { useEffect, useState } from 'react';
import { CertificateData } from '../types/certificate';
import AlpPrint from './AlpPrint';
import MbPrint from './MbPrint';

const PrintCertificate: React.FC = () => {
    const [data, setData] = useState<CertificateData | null>(null);

    useEffect(() => {
        try {
            // Prefer sessionStorage (from same-tab flows) but fall back to localStorage (used when opening new tab)
            const rawSession = sessionStorage.getItem('printData');
            const rawLocal = localStorage.getItem('printData');
            const raw = rawSession ?? rawLocal;
            if (!raw) return;
            const parsed = JSON.parse(raw) as CertificateData;
            setData(parsed);
        } catch (e) {
            console.error('Failed to load print data', e);
        }
    }, []);

    useEffect(() => {
        if (data) {
            // allow immediate print from the new tab if desired
            // window.print(); // commented out so user can inspect before printing
        }
    }, [data]);

    if (!data) return <div style={{ padding: 24 }}>No print data found. Open the print view from the form.</div>;

    if (data.certificateType === 'ALP') {
        return <AlpPrint data={data} />;
    }

    return <MbPrint data={data} />;
};

export default PrintCertificate;
