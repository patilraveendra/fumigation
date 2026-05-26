import React from 'react';
import { CertificateData } from '../types/certificate';

interface AlpPrintProps {
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

const AlpPrint: React.FC<AlpPrintProps> = ({ data }) => {
    const destinationCountry = value(data.destinationCountry, data.tc_country);
    const dosage = value(`${value(data.f_doserate, data.doseRate)} ${value(data.f_dosetype)}`.trim());
    const duration = value(`${value(data.f_duration, data.durationFumigation)} ${value(data.f_hour)}`.trim());
    const exporterName = value(data.d_name, data.exporterName);
    const consigneeName = value(data.c_name, data.consigneeName);
    const quantity = value(data.quantityDeclared, data.commodityQuantity, data.noOfQuantity);
    const packaging = value(data.packagingMaterial, data.detail, '--');
    const shippingMark = value(data.shippingMark, data.l_ship);
    const invoice = value(data.invoiceno, [data.invoiceNumber, formatDate(data.invoiceDate)].filter(Boolean).join(' dated '));
    const declaration = value(data.declaration, data.declarationText);

    const td: React.CSSProperties = {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 12,
        color: '#000',
        textTransform: 'uppercase',
        lineHeight: 1.22,
    };

    const para: React.CSSProperties = {
        paddingTop: 12,
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
        fontSize: 14,
        color: '#333',
        textAlign: 'justify',
        fontStyle: 'italic',
        letterSpacing: 1,
        lineHeight: 1.12,
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

    const goodsLabelCell = (extra: React.CSSProperties = {}) => cell('lbr', {
        width: '34%',
        ...extra,
    });

    const goodsValueCell = (extra: React.CSSProperties = {}) => cell('br', {
        width: '66%',
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
                        .alp-print-wrap { width: 210mm !important; max-height: 297mm !important; }
                    }
                `}
            </style>
            <table
                className="alp-print-wrap"
                width="804"
                align="center"
                cellPadding={0}
                cellSpacing={0}
                style={{ width: '210mm', maxHeight: '297mm', borderCollapse: 'collapse' }}
            >
                <tbody>
                    <tr>
                        <td width="47" rowSpan={4} align="left" valign="middle" />
                        <td width="713" height="100">
                            <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td colSpan={4}>
                                            <br /><br /><br /><br /><br /><br /><br />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }} align="center" cellPadding={0} cellSpacing={0}>
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            colSpan={2}
                                                            rowSpan={2}
                                                            align="left"
                                                            valign="top"
                                                            style={cell('ltrb', { textAlign: 'justify' })}
                                                        >
                                                            PEST RELIEF (INDIA) PVT. LTD.<br />
                                                            711/712, 7th floor, commodity exchange building, sector-19, vashi, navi mumbai-400703 (ms)<br />
                                                            <strong>
                                                                Dte PPQS Regd. No :IN-ALP-MUM0015
                                                                <span style={{ float: 'right' }}>dt: 03-06-2012</span>
                                                            </strong>
                                                        </td>
                                                        <td width="56%" height="35" colSpan={2} style={cell('tr')}>
                                                            Treatment Certificate Number :&nbsp; {value(data.certificateNumber)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" colSpan={2} style={cell('trb')}>
                                                            Date of Issue : &nbsp; {formatDate(value(data.dateIssued))}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td height="35" colSpan={4} style={para}>
                                            <em>
                                                &nbsp;&nbsp;&nbsp;&nbsp;This is to certify that the goods described below were treated in accordance with the fumigation treatment requirements of importing country <strong>{destinationCountry}</strong> and declared that the consignment has been verified free of impervious surfaces/layers such as plastic wrapping or laminated plastic films, lacquered or painted surfaces, aluminium foil, tarred or waxed paper etc., that may adversely effect the penetration of the fumigant, prior to fumigation.
                                                <br />
                                                &nbsp;&nbsp;&nbsp;&nbsp;The Certificate is valid for the consignments shipped within 21 days from the date of completion of fumigation.
                                            </em>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td height="35" colSpan={4} align="center" valign="middle" style={{ ...border('b'), padding: 22 }}>
                                            <strong>DETAILS OF TREATMENT</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }} align="center" cellPadding={0} cellSpacing={0}>
                                                <tbody>
                                                    <tr>
                                                        <td width="28%" height="35" style={cell('lb')}>Name of Fumigant :</td>
                                                        <td width="22%" style={cell('lbr')}>{value(data.f_type, data.fumigantName)}</td>
                                                        <td width="32%" height="35" style={cell('b')}>Date of Fumigation :</td>
                                                        <td width="18%" style={cell('blr')}>{formatDate(value(data.f_date, data.fumigationStarted))}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" style={cell('lb')}>Place of Fumigation :</td>
                                                        <td height="35" style={cell('lbr')}>&nbsp;{value(data.f_place, data.placeOfFumigation)}</td>
                                                        <td height="35" style={cell('b')}>Dosage of Fumigant :</td>
                                                        <td height="35" style={cell('blr')}>&nbsp;{dosage}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" colSpan={2} style={cell('lbr')}>Duration of Fumigation :</td>
                                                        <td height="35" colSpan={2} style={cell('br')}>{duration}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" colSpan={2} style={cell('lbr')}>Average ambient humidity during fumigation :</td>
                                                        <td height="35" colSpan={2} style={cell('br')}>{value(data.humidity)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" colSpan={2} style={cell('lbr')}>Fumigation Performed under gastight sheets :</td>
                                                        <td height="35" colSpan={2} style={cell('br')}>{value(data.f_performed, data.gasTightSheets)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td height="35" colSpan={4} align="center" valign="middle" style={{ ...border('b'), padding: 22 }}>
                                            <strong>DESCRIPTION OF GOODS</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }} align="center" cellPadding={0} cellSpacing={0}>
                                                <tbody>
                                                    <tr>
                                                        <td height="35" style={goodsLabelCell()}>Name &amp; Address of Exporter :</td>
                                                        <td height="35" style={goodsValueCell()}>
                                                            {exporterName}<br />{value(data.d_address)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" style={goodsLabelCell()}>Name &amp; Address of consignee :</td>
                                                        <td height="35" style={goodsValueCell()}>
                                                            {consigneeName}<br />{value(data.c_address)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" valign="middle" style={goodsLabelCell()}>Type &amp; Description Of Cargo :</td>
                                                        <td height="35" valign="middle" style={goodsValueCell()}>
                                                            {value(data.marks, data.commodityDescription)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" valign="middle" style={goodsLabelCell()}>Quantity (MTs)/No of Packages/No of Pieces :</td>
                                                        <td height="35" valign="middle" style={goodsValueCell()}>{quantity}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" valign="middle" style={goodsLabelCell()}>Description of Packaging Material :</td>
                                                        <td height="35" valign="middle" style={goodsValueCell()}>{packaging}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" valign="middle" style={goodsLabelCell()}>Shipping mark or brand :</td>
                                                        <td height="35" valign="middle" style={goodsValueCell()}>{shippingMark}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height="35" valign="middle" style={goodsLabelCell()}>Invoice No. and Date :</td>
                                                        <td height="35" valign="middle" style={goodsValueCell()}>{invoice}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td height="35" align="left" valign="middle" style={cell('', { padding: 5 })}>
                            <strong><u>&nbsp;Additional Declaration</u></strong> : {declaration}
                        </td>
                        <td width="32">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style={cell('', { padding: 5, fontSize: 9 })}>
                            &nbsp;I declare that these details are true &amp; correct and the fumigation has been carried out in accordence with NSPM22.
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AlpPrint;
