import React, { useEffect, useState } from 'react';
import { CertificateData } from '../types/certificate';

const PrintCertificate: React.FC = () => {
    const [data, setData] = useState<CertificateData | null>(null);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem('printData');
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

    return (
        <div style={{ padding: 12, fontFamily: 'Arial, Helvetica, sans-serif', color: '#000' }}>
            <table align="center" cellPadding={0} cellSpacing={0} style={{ width: '210mm', maxWidth: '100%' }}>
                <tbody>
                    <tr>
                        <td style={{ verticalAlign: 'top', paddingRight: 12, width: 38 }}>&nbsp;</td>
                        <td>
                            <table width="100%" cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    <tr>
                                        <td colSpan={2} style={{ height: 40 }} />
                                    </tr>
                                    <tr>
                                        <td style={{ width: '48%', verticalAlign: 'top', textAlign: 'left' }}>
                                            <div style={{ fontWeight: 600 }}>Pest & Solutions</div>
                                            <div>Address line 1</div>
                                            <div>Address line 2</div>
                                            <div style={{ marginTop: 6 }}>
                                                <strong>Dte. PPQS Regn. No. : {data.providerId}</strong>
                                            </div>
                                        </td>
                                        <td style={{ width: '52%', textAlign: 'right', verticalAlign: 'top' }}>
                                            <div><strong>Treatment Certificate Number : {data.certificateNumber}</strong></div>
                                            <div style={{ marginTop: 6 }}><strong>Date of Issue : {data.dateIssued}</strong></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} style={{ paddingTop: 12, textAlign: 'justify' }}>
                                            This is to certify that the goods described below were treated in accordance with the fumigation treatment requirements of importing country, and declared that the consignment has been verified free of impervious surface/layers prior to fumigation. The Certificate is valid for the consignments shipped within 21 days from the date of completion of fumigation.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={2} style={{ paddingTop: 12, textAlign: 'center', fontWeight: 700 }}>DETAILS OF TREATMENT</td>
                    </tr>

                    <tr>
                        <td colSpan={2}>
                            <table width="100%" style={{ border: '1px solid #000', borderCollapse: 'collapse', marginTop: 6 }}>
                                <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: 6, width: '22%' }}>Name of fumigant</td>
                                        <td style={{ border: '1px solid #000', padding: 6, width: '29%' }}>{data.f_type || data.fumigantName}</td>
                                        <td style={{ border: '1px solid #000', padding: 6, width: '22%' }}>Date of fumigation</td>
                                        <td style={{ border: '1px solid #000', padding: 6, width: '27%' }}>{data.f_date || data.fumigationStarted}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>Place of Fumigation</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.f_place || data.placeOfFumigation}</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>Dosage rate of fumigant</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.f_doserate} {data.f_dosetype}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ border: '1px solid #000', padding: 6 }}>Duration of Fumigation</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.durationFumigation} {data.f_hour}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ border: '1px solid #000', padding: 6 }}>Average ambient temperature during fumigation (°C)</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.f_temperature || data.temperature} {data.f_ttype}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ border: '1px solid #000', padding: 6 }}>Fumigation performed under gastight sheets</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.f_performed}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>


                    <tr>
                        <td colSpan={2} style={{ paddingTop: 12, textAlign: 'center', fontWeight: 700 }}>DESCRIPTION OF GOODS</td>
                    </tr>

                    <tr>
                        <td colSpan={2}>
                            <table width="100%" style={{ borderCollapse: 'collapse', marginTop: 6 }}>
                                <tbody>
                                    {/* Conditionally show container numbers/seals row if cnoat includes 'Format' */}
                                    {data.cnoat && data.cnoat.toLowerCase().includes('format') && data.containers && data.containers.length > 0 && (
                                        <tr>
                                            <td style={{ border: '1px solid #000', padding: 6 }}>Container Number (or numerical link)/Seal Number</td>
                                            <td style={{ border: '1px solid #000', padding: 6 }}>
                                                {data.containers.map((c, idx) => (
                                                    <div key={idx}>
                                                        {c.cont} {c.seal ? `/ ${c.seal}` : ''}
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: 6, width: '30%' }}>Type and description of cargo</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.marks || data.commodityDescription}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>Quantity (MTs)/No of packages/No of pieces</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.quantityDeclared || data.commodityQuantity}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>Description of packaging materials</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.detail}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>Shipping mark or brand</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.shippingMark}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>Name and address of Consignor / Exporter</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.exporterName}<br />{data.d_address}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>Declared name & address of Consignee</td>
                                        <td style={{ border: '1px solid #000', padding: 6 }}>{data.consigneeName}<br />{data.c_address}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={2} style={{ paddingTop: 12 }}>
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td style={{ padding: 6 }}><strong>Additional Declaration</strong> :</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: 6, fontSize: 12 }}>
                                            {data.declaration}
                                            {/* If cnoat includes 'Additional Declaration', append container numbers/seals here */}
                                            {data.cnoat && data.cnoat.toLowerCase().includes('additional declaration') && data.containers && data.containers.length > 0 && (
                                                <div style={{ marginTop: 8 }}>
                                                    <strong>Container Numbers/Seals:</strong>
                                                    <div>
                                                        {data.containers.map((c, idx) => (
                                                            <div key={idx}>
                                                                {c.cont} {c.seal ? `/ ${c.seal}` : ''}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PrintCertificate;
