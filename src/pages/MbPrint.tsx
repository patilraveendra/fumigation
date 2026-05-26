import React from 'react';
import { CertificateData } from '../types/certificate';

interface MbPrintProps {
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

const MbPrint: React.FC<MbPrintProps> = ({ data }) => {
    const destinationCountry = value(data.destinationCountry, data.tc_country);
    const dosage = value(`${value(data.f_doserate, data.doseRate)} ${value(data.f_dosetype)}`.trim());
    const duration = value(`${value(data.f_duration, data.durationFumigation)} ${value(data.f_hour)}`.trim());
    const temperature = value(`${value(data.f_temperature, data.temperature)} ${value(data.f_ttype)}`.trim());
    const exporterName = value(data.d_name, data.exporterName);
    const consigneeName = value(data.c_name, data.consigneeName);
    const quantity = value(data.quantityDeclared, data.commodityQuantity, data.noOfQuantity);
    const packaging = value(data.packagingMaterial, data.detail, '.');
    const shippingMark = value(data.shippingMark, data.l_ship, '.');
    const invoice = value(data.invoiceno, [data.invoiceNumber, formatDate(data.invoiceDate)].filter(Boolean).join(' dated '));
    const declaration = value(data.declaration, data.declarationText);
    const showContainerRow = data.cnoat?.toLowerCase().includes('format') && data.containers && data.containers.length > 0;

    const td: React.CSSProperties = {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 12,
        color: '#000',
        textTransform: 'uppercase',
        lineHeight: 1.2,
        height: 20,
    };

    const paragraph: React.CSSProperties = {
        paddingTop: 12,
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
        fontSize: 12,
        color: '#333',
        textAlign: 'justify',
        fontStyle: 'italic',
        letterSpacing: 1,
        lineHeight: 1.15,
    };

    const border = (sides: string): React.CSSProperties => ({
        borderLeft: sides.includes('l') ? '1px solid #666' : undefined,
        borderRight: sides.includes('r') ? '1px solid #666' : undefined,
        borderTop: sides.includes('t') ? '1px solid #666' : undefined,
        borderBottom: sides.includes('b') ? '1px solid #666' : undefined,
    });

    const cell = (sides: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
        ...td,
        ...border(sides),
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
                        .mb-print-wrap { width: 210mm !important; max-height: 300mm !important; }
                    }
                `}
            </style>
            <table
                className="mb-print-wrap"
                align="center"
                cellPadding={0}
                cellSpacing={0}
                style={{ width: '210mm', maxHeight: '300mm', borderCollapse: 'collapse' }}
            >
                <tbody>
                    <tr>
                        <td width="38" rowSpan={7}>
                            <br /><br /><br /><br /><br /><br /><br />
                        </td>
                        <td align="left">
                            <table width="100%" cellPadding={0} cellSpacing={0} style={{ border: '1px solid #666', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td colSpan={2}>
                                            <br /><br /><br /><br /><br /><br />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            width="48%"
                                            rowSpan={2}
                                            valign="top"
                                            align="left"
                                            style={cell('ltrb', { textAlign: 'justify' })}
                                        >
                                            PEST RELIEF (INDIA) PVT. LTD.<br />
                                            711, 712 Commodity Exchange Building, sector 19,<br />
                                            vashi, NAVI MUMBAI-400 703. Maharashtra INDIA.
                                            <br />
                                            <strong>
                                                Dte. PPQS Regn. No. :MB/343
                                                <span style={{ float: 'right' }}>DT: 27-07-2010</span>
                                            </strong>
                                        </td>
                                        <td width="52%" height="20" style={cell('tr')}>
                                            <strong>Treatment Certificate Number :&nbsp; {value(data.certificateNumber)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="52%" height="20" style={cell('trb')}>
                                            <strong>Date of Issue :&nbsp;{formatDate(value(data.dateIssued))}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td height="33" colSpan={2} style={paragraph}>
                                            &nbsp;&nbsp;&nbsp;&nbsp;This is to certify that the goods described below were treated in accordance with the fumigation treatment requirements of importing country <strong>&nbsp;{destinationCountry}</strong>, and declared that the consignment has been verified free of impervious surface/layers such as plastic wrapping or laminated plastic films, lacquered or painted surfaces, Aluminum foil, tarred or waxed paper etc. that may adversely affect the penetration of the fumigant, prior to fumigation.
                                            <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;The Certificate is valid for the consignments shipped within 21 days from the date of completion of fumigation.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="20" align="center" style={{ padding: 12 }}>
                            <b style={{ fontSize: 15 }}>DETAILS OF TREATMENT</b>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width="100%" cellPadding={0} cellSpacing={0} style={{ border: '1px solid #000', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td width="22%" style={cell('br')}>Name of fumigant</td>
                                        <td width="29%" style={cell('br')}>{value(data.f_type, data.fumigantName)}</td>
                                        <td width="22%" style={cell('br')}>Date of fumigation</td>
                                        <td width="27%" style={cell('b')}>{formatDate(value(data.f_date, data.fumigationStarted))}</td>
                                    </tr>
                                    <tr>
                                        <td height="5" style={cell('br')}>Place of Fumigation</td>
                                        <td style={cell('br')}>{value(data.f_place, data.placeOfFumigation)}</td>
                                        <td style={cell('br')}>Dosage rate of fumigant</td>
                                        <td style={cell('b')}>{dosage}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={cell('br')}>Duration of Fumigation</td>
                                        <td style={cell('br')}>{duration}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={cell('br')}>
                                            Average ambient temperature during fumigation (<sup><small>o</small></sup>C)
                                        </td>
                                        <td style={cell('b')}>{temperature}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={cell('br')}>Fumigation performed under gastight sheets</td>
                                        <td style={cell('b')}>{value(data.f_performed, data.gasTightSheets)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={cell('br')}>
                                            If containers are not fumigates under gastight sheets, pressure decay value (from 200-100 Pascal's) in seconds
                                        </td>
                                        <td style={cell('b')}>{value(data.finalTlvReading, 'N/A')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td width="754" align="center" style={{ padding: 12 }}>
                            <b style={{ fontSize: 15 }}>DESCRIPTION OF GOODS</b>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width="100%" cellPadding={0} cellSpacing={0} style={{ border: '1px solid #666', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {showContainerRow ? (
                                        <tr>
                                            <td align="left" valign="top" style={cell('lbr')}>Container Number (or numerical link)/Seal Number</td>
                                            <td align="left" valign="top" style={cell('br')}>
                                                {data.containers?.map((container, index) => (
                                                    <div key={`${container.cont}-${index}`}>
                                                        {container.cont}{container.seal ? ` / ${container.seal}` : ''}
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    ) : null}
                                    <tr>
                                        <td align="left" valign="top" style={cell('lbr')}>Type and description of cargo</td>
                                        <td align="left" valign="top" style={cell('br')}>{value(data.marks, data.commodityDescription)}</td>
                                    </tr>
                                    <tr>
                                        <td align="left" valign="top" style={cell('lbr')}>Quantity (MTs)/No of packages/No of pieces</td>
                                        <td align="left" valign="top" style={cell('br')}>{quantity || '.'}</td>
                                    </tr>
                                    <tr>
                                        <td width="22%" align="left" valign="top" style={cell('lbr')}>Description of packaging materials</td>
                                        <td width="78%" align="left" valign="top" style={cell('br')}>{packaging}</td>
                                    </tr>
                                    <tr>
                                        <td align="left" valign="top" style={cell('lbr')}>Shipping mark or brand</td>
                                        <td align="left" valign="top" style={cell('br')}>{shippingMark}</td>
                                    </tr>
                                    <tr>
                                        <td style={cell('lbr')}>
                                            Name and address of<br />Consignor / Exporter
                                        </td>
                                        <td style={cell('br')}>
                                            {exporterName}<br />{value(data.d_address)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" valign="top" style={cell('lbr')}>
                                            Declared name &amp; Address&nbsp;of<br />Consignee
                                        </td>
                                        <td style={cell('br')}>
                                            {consigneeName}<br />{value(data.c_address)}
                                        </td>
                                    </tr>
                                    {invoice ? (
                                        <tr>
                                            <td style={cell('lbr')}>&nbsp;INVOICE NO. AND DATE</td>
                                            <td style={cell('br')}>{invoice}</td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={cell('')}>
                                            <strong><u>&nbsp;Additional Declaration</u></strong> : {declaration}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={cell('', { fontSize: 9 })}>
                                            &nbsp;I declare that these details are true &amp; correct and the fumigation has been carried out in accordence with the NSPM 12 standards.
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

export default MbPrint;
