import React from 'react';
import { CertificateData } from '../types/certificate';

interface AusPrintProps {
    data: CertificateData;
}

function value(...items: Array<string | undefined>) {
    return items.find((item) => item && item.trim())?.trim() ?? '';
}

function formatDate(date?: string) {
    if (!date) return '';

    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
        return `${match[3]}-${match[2]}-${match[1]}`;
    }

    return date;
}

const AusPrint: React.FC<AusPrintProps> = ({ data }) => {
    const destinationCountry = value(data.destinationCountry, data.tc_country);
    const dosage = value(`${value(data.f_doserate, data.doseRate)} ${value(data.f_dosetype)}`.trim());
    const duration = value(`${value(data.f_duration, data.durationFumigation)} ${value(data.f_hour)}`.trim());
    const exporterName = value(data.d_name, data.exporterName);
    const consigneeName = value(data.c_name, data.consigneeName);
    const quantity = value(data.quantityDeclared, data.commodityQuantity, data.noOfQuantity);
    const portOfLoading = value(data.portOfLoading);
    const countryOfOrigin = value(data.countryOfOrigin);
    const exporterInvoice = value(data.invoiceno, data.invoiceNumber);
    const exporterAddress = value(data.d_address);
    const placeAddress = value(data.d_address);
    const placeCity = value(data.c_address);
    const placePostcode = value((data as any).placePostcode, (data as any).postcode);
    const DAWR = value(data.f_doserate, data.doseRate);
    const exposure = value(data.exposurePeriod, data.exposurePeriod || data.f_duration || data.f_duration_days);
    const enclosureType = value(data.f_performed, data.gasTightSheets);
    const finalTlv = value(data.finalTlvReading, data.finalTlvReading || data.finalTlvReading);
    const containerPlace = value(data.cnoat);
    const additionalDeclaration = value(data.declaration, data.declarationText);
    const officeRemark = value(data.oremark);
    const workOrder = value((data as any).workOrder, data.detail);

    const td: React.CSSProperties = {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 12,
        color: '#000',
        textTransform: 'uppercase',
        lineHeight: 1.22,
    };

    const cell = (sides: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
        ...td,
        borderLeft: sides.includes('l') ? '1px solid #666' : undefined,
        borderRight: sides.includes('r') ? '1px solid #666' : undefined,
        borderTop: sides.includes('t') ? '1px solid #666' : undefined,
        borderBottom: sides.includes('b') ? '1px solid #666' : undefined,
        padding: 5,
        verticalAlign: 'middle',
        ...extra,
    });

    return (
        <div style={{ color: '#000', background: '#fff' }}>
            <style>
                {`
                    body { margin-left: 0; margin-top: 0; color: #000; }
                    @page { size: A4; margin: 0; }
                    @media print {
                        .noprint { display: none; }
                        .aus-print-wrap { width: 210mm !important; max-height: 297mm !important; }
                    }
                `}
            </style>
            <table
                className="aus-print-wrap"
                width="100%"
                align="center"
                cellPadding={0}
                cellSpacing={0}
                style={{ width: '210mm', maxHeight: '297mm', borderCollapse: 'collapse' }}
            >
                <tbody>
                    <tr>
                        <td colSpan={2}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: 10 }}>
                                            <div style={{ fontSize: 24, color: '#4d86b5', fontWeight: 600 }}>AUS Certificate <span style={{ fontSize: 16, color: '#777', fontWeight: 400 }}>»New AUS</span></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={cell('l')}>* Treatment Certificate No :</td>
                                                        <td style={cell('r')}>{value(data.certificateNumber)}</td>
                                                        <td style={cell('l')}>* Date Of Certificate :</td>
                                                        <td style={cell('r')}>{formatDate(value(data.dateIssued))}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>* DPPQS Registration No :</td>
                                                        <td style={cell('r')}>{value(data.providerId, data.accreditationNumber)}</td>
                                                        <td style={cell('l')}>Work Order :</td>
                                                        <td style={cell('r')}>{workOrder}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingTop: 10 }}>
                                            <div style={{ textAlign: 'center', fontWeight: 700, padding: 8, borderTop: '1px solid #ccc', borderBottom: '1px solid #666' }}>TARGET OF FUMIGATION DETAIL</div>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={cell('l')}>* Target of Fumigation :</td>
                                                        <td style={cell('r')}>{data.commodityDescription ? '☑ Commodity' : '☐ Commodity'} &nbsp; {data.containers && data.containers.length ? '☑ Container' : '☐ Container'} &nbsp; {data.packagingMaterial ? '☑ Packing' : '☐ Packing'}</td>
                                                        <td style={cell('l')}>Other:</td>
                                                        <td style={cell('r')}>{value((data as any).other)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>* Commodity :</td>
                                                        <td colSpan={3} style={cell('r')}>{value(data.commodityDescription)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>* Quantity declared :</td>
                                                        <td style={cell('r')}>{value(data.quantityDeclared, data.commodityQuantity)}</td>
                                                        <td style={cell('l')}>* No Of Quantity:</td>
                                                        <td style={cell('r')}>{value(data.noOfQuantity)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>Consignment Link :</td>
                                                        <td style={cell('r')}>{value((data as any).consignmentLink)}</td>
                                                        <td style={cell('l')}>* Country of origin :</td>
                                                        <td style={cell('r')}>{countryOfOrigin}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>* Port of Loading :</td>
                                                        <td style={cell('r')}>{portOfLoading}</td>
                                                        <td style={cell('l')}>* Country of Destination :</td>
                                                        <td style={cell('r')}>{destinationCountry}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>* Name of Exporter :</td>
                                                        <td style={cell('r')}>{exporterName}</td>
                                                        <td style={cell('l')}>* Exporter Invoice No :</td>
                                                        <td style={cell('r')}>{exporterInvoice}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>Name of Exporter</td>
                                                        <td style={cell('r')}>{exporterName}</td>
                                                        <td style={cell('l')}>Address of Exporter</td>
                                                        <td style={cell('r')}>{exporterAddress}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>Place Address</td>
                                                        <td style={cell('r')}>{placeAddress}</td>
                                                        <td style={cell('l')}>Place City</td>
                                                        <td style={cell('r')}>{placeCity}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>Place Country</td>
                                                        <td style={cell('r')}>{value(data.countryOfOrigin)}</td>
                                                        <td style={cell('l')}>Place Postcode</td>
                                                        <td style={cell('r')}>{placePostcode}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingTop: 12 }}>
                                            <div style={{ textAlign: 'center', fontWeight: 700, padding: 8, borderTop: '1px solid #ccc', borderBottom: '1px solid #666' }}>TREATMENT DETAILS</div>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={cell('l')}>Date of Fumigation Commenced</td>
                                                        <td style={cell('r')}>{formatDate(value(data.fumigationStarted, data.f_date))}</td>
                                                        <td style={cell('l')}>Time of Fumigation Commenced</td>
                                                        <td style={cell('r')}>{value((data as any).f_starttime)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>Date of Fumigation Completed</td>
                                                        <td style={cell('r')}>{formatDate(value(data.fumigationCompleted, (data as any).f_date_completed))}</td>
                                                        <td style={cell('l')}>Time of Fumigation Completed</td>
                                                        <td style={cell('r')}>{value((data as any).f_endtime)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>* DAWR prescribed dose rate (g/m3) :</td>
                                                        <td style={cell('r')}>{DAWR}</td>
                                                        <td style={cell('l')}>* Exposure period (hrs) :</td>
                                                        <td style={cell('r')}>{exposure}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>* Forecast minimum temp (C) :</td>
                                                        <td style={cell('r')}>{value(data.temperature)}</td>
                                                        <td style={cell('l')}>* Applied Dosage rate (g/m3):</td>
                                                        <td style={cell('r')}>{dosage}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>* Enclosure Type :</td>
                                                        <td style={cell('r')}>{enclosureType}</td>
                                                        <td style={cell('l')}>Consignment Link / Container No</td>
                                                        <td style={cell('r')}>Click To Add Container Number</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingTop: 12 }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={cell('l')}>* Ventilation Final TLV reading(ppm) :</td>
                                                        <td style={cell('r')}>{finalTlv || '00 PPM'}</td>
                                                        <td style={cell('l')}>* Container No. Place :</td>
                                                        <td style={cell('r')}>{containerPlace || 'In Additional Declaration'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={cell('l')}>* Additional Declaration :</td>
                                                        <td style={cell('r')}>{additionalDeclaration}</td>
                                                        <td style={cell('l')}>Office Remark</td>
                                                        <td style={cell('r')}>{officeRemark}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="35" align="left" valign="middle" style={cell('', { padding: 5 })}>
                            <strong><u>&nbsp;Additional Declaration</u></strong> :
                            <div style={{ marginTop: 4 }}>{value(data.declaration, data.declarationText)}</div>
                        </td>
                        <td width="32">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style={cell('', { padding: 5, fontSize: 9 })}>
                            &nbsp;I declare that these details are true &amp; correct and the fumigation has been carried out in accordance with requirements.
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AusPrint;
