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

function isAdditionalFlag(val?: string) {
    const s = val?.toLowerCase() ?? '';
    return s.includes('additional') || s.includes('addtional') || s.includes('addit');
}

const MbPrint: React.FC<MbPrintProps> = ({ data }) => {
    const destinationCountry = value(data.destinationCountry, data.tc_country);
    // Dosage: prefer explicit dose and type; fall back to default unit when missing
    const doseVal = value(data.f_doserate, data.doseRate);
    const doseUnit = value(data.f_dosetype);
    const dosage = doseVal ? `${doseVal}${doseUnit ? ` ${doseUnit}` : ' GRMS /CU.M'}` : '';

    // Duration: prefer explicit duration and hour unit; fall back to HOURS
    const durVal = value(data.f_duration, data.durationFumigation);
    const durUnit = value(data.f_hour);
    const duration = durVal ? `${durVal}${durUnit ? ` ${durUnit}` : ' HOURS'}` : '';

    // Temperature: prefer explicit temperature and unit; fall back to DEG. CELSIUS
    const tempVal = value(data.f_temperature, data.temperature);
    const tempUnit = value(data.f_ttype);
    const temperature = tempVal ? `${tempVal}${tempUnit ? ` ${tempUnit}` : ' DEG. CELSIUS'}` : '';
    const exporterName = value(data.d_name, data.exporterName);
    const consigneeName = value(data.c_name, data.consigneeName);
    const quantity = value(data.quantityDeclared, data.commodityQuantity, data.noOfQuantity);
    const packaging = value(data.packagingMaterial, data.detail, '.');
    const shippingMark = value(data.shippingMark, data.l_ship, '.');
    const invoice = value(data.invoiceno, [data.invoiceNumber, formatDate(data.invoiceDate)].filter(Boolean).join(' dated '));
    const declaration = value(data.declaration, data.declarationText);
    const fcoi = value(data.fcoi);

    let additionalDeclarationText = declaration || '';

    const containerRows = (data.containers ?? [])
        .map((container) => {
            const contValue = value(container.cont);
            const sealValue = value(container.seal);
            if (!contValue && !sealValue) return undefined;
            return `${contValue}${sealValue ? ` / ${sealValue}` : ''}`;
        })
        .filter(Boolean) as string[];

    const showContainerRow = containerRows.length > 0 && data.cnoat?.toLowerCase().includes('format');

    const declarationLines = [
        declaration,
        isAdditionalFlag(data.cnoat) && containerRows.length > 0
            ? `Container Number (or numerical link) / Seal Number: ${containerRows.join(', ')}`
            : undefined,
    ].filter(Boolean) as string[];

    let standardDeclarationText = '';
    standardDeclarationText = 'I declare that these details are true & correct and the fumigation has been carried out in accordance with the NSPM 12 standards.';

    if (fcoi) {
        const fc = fcoi.toLowerCase();
        if (fc.includes('nspm 12 and ispm 15')) {
            standardDeclarationText = 'I declare that these details are true & correct and the fumigation has been carried out in accordance with NSPM 12 and ISPM 15 regulations of IPPC.';
        } else if (fc.includes('nspm 12')) {
            standardDeclarationText = 'I declare that these details are true & correct and the fumigation has been carried out in accordance with the NSPM 12 standards.';
        }
    }
    const hasContainers = (data.containers ?? []).length > 0;
    const cnoat = (data.cnoat ?? '').toString().toLowerCase();
    // Strict behavior: when dropdown indicates 'format' show in container row;
    // when dropdown indicates 'additional' show in Additional Declaration.
    // const showContainerRow = cnoat.includes('format') && hasContainers;
    const showContainersInDeclaration = isAdditionalFlag(cnoat) && hasContainers;

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
                        <td colSpan={4}>
                            <br /><br /><br /><br /><br /><br /><br />
                        </td>
                    </tr>
                    <tr>
                        <td width="38" rowSpan={7}>
                            <br /><br /><br /><br /><br /><br /><br />
                        </td>
                        <td align="left">
                            <table width="100%" cellPadding={0} cellSpacing={0} style={{ border: '1px solid #666', borderCollapse: 'collapse' }}>
                                <tbody>

                                    <tr>
                                        <td
                                            width="50%"
                                            rowSpan={2}
                                            valign="top"
                                            align="left"
                                            style={cell('ltrb', { textAlign: 'justify' })}
                                        >
                                            PEST AND SOLUTIONS<br />
                                            721, Commodity Exchange Building, Sector 19,
                                            Vashi, Navi Mumbai-400 703. Maharashtra, India.

                                            <br />
                                            <strong>
                                                Dte PPQS Regd. No : IN-MB-MUM1131 Dt: 29-01-2026

                                            </strong>
                                        </td>
                                        <td width="50%" height="20" style={cell('tr')}>
                                            <strong>Treatment Certificate Number :&nbsp; {value(data.certificateNumber)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="50%" height="20" style={cell('trb')}>
                                            <strong>Date of Issue :&nbsp;{formatDate(value(data.dateIssued))}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td height="33" colSpan={2} style={paragraph}>
                                            &nbsp;&nbsp;&nbsp;&nbsp;This is to certify that the goods described below were treated in accordance with the fumigation treatment requirements of importing country <strong>&nbsp;{destinationCountry}</strong>, and declared that the consignment has been verified free of impervious surface/layers such as plastic wrapping or laminated plastic films, lacquered or painted surfaces, Aluminum foil, tarred or waxed paper etc. that may adversely affect the penetration of the fumigant, prior to fumigation.
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
                                                {(() => {
                                                    const containers = data.containers ?? [];
                                                    const count = containers.length;
                                                    const ct20 = (data.ct20 || '').toString().trim();
                                                    const ct40 = (data.ct40 || '').toString().trim();
                                                    let selectedType = '';
                                                    if (ct20 && !ct40) selectedType = `20' ${ct20}`;
                                                    else if (ct40 && !ct20) selectedType = `40' ${ct40}`;
                                                    else if (ct20) selectedType = `20' ${ct20}`;
                                                    // don't append suffix to each container number — only show in the summary header
                                                    return (
                                                        <div>
                                                            {selectedType ? <div style={{ marginBottom: 6 }}><strong>{`${count} X ${selectedType}`}</strong></div> : null}
                                                            {containers.map((container: any, index: number) => (
                                                                <div key={`${container.cont}-${index}`}>
                                                                    {container.cont ? `${container.cont}` : ''}{container.seal ? ` / ${container.seal}` : ''}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                })()}
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
                                    {data.notify ? (
                                        <tr>
                                            <td style={cell('lbr')}>Notify Party</td>
                                            <td style={cell('br')}>{value(data.notify)}</td>
                                        </tr>
                                    ) : null}
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
                                        <td height="35" align="left" valign="middle" style={cell('', { padding: 5 })}>
                                            <strong><u>&nbsp;Additional Declaration</u></strong> :
                                            {declarationLines.map((line, index) => (
                                                <div key={index} style={{ marginTop: index === 0 ? 0 : 4 }}>
                                                    {line}
                                                </div>
                                            ))}
                                        </td>
                                        <td width="32">&nbsp;</td>
                                    </tr>
                                    {/*  <tr>
                                        <td style={cell('', { fontSize: 9 })}>
                                            {additionalDeclarationText}
                                            {showContainersInDeclaration ? (
                                                <div style={{ marginTop: 8 }}>
                                                    <strong>Container Numbers/Seals:</strong>
                                                    <div>
                                                        {data.containers?.map((c, idx) => (
                                                            <div key={`decl-cont-${idx}`}>
                                                                {c.cont}{c.seal ? ` / ${c.seal}` : ''}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </td>
                                    </tr>*/}
                                    <tr>
                                        <td style={cell('', { padding: 5, fontSize: 9 })}>
                                            {standardDeclarationText}  &nbsp;
                                        </td>
                                        <td>&nbsp;</td>
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
