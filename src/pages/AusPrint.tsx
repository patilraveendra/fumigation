import React from 'react';
import { CertificateData } from '../types/certificate';

interface AusPrintProps {
    data: CertificateData;
}

function value(...items: Array<string | undefined | null>) {
    return items.find((item) => typeof item === 'string' && item.trim())?.toString().trim() ?? '';
}

function formatDate(date?: string) {
    if (!date) return '';
    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return `${match[3]}/${match[2]}/${match[1]}`;
    return date;
}

function joinValues(items: Array<string | undefined | null>, separator = ', ') {
    return items
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
        .join(separator);
}

const CheckBox: React.FC<{ checked?: boolean }> = ({ checked }) => (
    <span className={`aus-checkbox${checked ? ' aus-checkbox-checked' : ''}`}>{checked ? 'X' : ''}</span>
);

const AusPrint: React.FC<AusPrintProps> = ({ data }) => {
    const certificateNo = value(data.certificateNumber);
    const dateIssued = formatDate(value(data.dateIssued));
    const providerId = value(data.providerId, data.accreditationNumber);
    const consignmentLink = value(
        data.consignmentLink,
        joinValues(data.containers?.map((container) => container.cont) ?? [])
    );
    const sealNumbers = value(
        data.sealNumber,
        joinValues(data.containers?.map((container) => container.seal) ?? []),
        'N/A'
    );
    const clientName = value(data.clientName, data.d_name, data.exporterName, data.c_name);
    const clientAddress = value(data.clientAddress, data.d_address, data.c_address);
    const commodityDescription = value(data.commodityDescription, data.marks, data.detail);
    const commodityQuantity = value(data.quantityDeclared, data.commodityQuantity, data.noOfQuantity);
    const countryOfOrigin = value(data.countryOfOrigin, data.tc_country);
    const portOfLoading = value(data.portOfLoading);
    const destinationCountry = value(data.destinationCountry, data.tc_country);
    const fumigationStreet = value(data.placeAddress, data.f_place, data.placeOfFumigation, data.d_address);
    const fumigationCity = value(data.placeCity, data.placeCity);
    const fumigationCountry = value(data.placeCountry, data.countryOfOrigin, data.tc_country);
    const fumigationPostcode = value(data.placePostcode);
    const fumigatorName = value(data.fumigatorName, data.d_name);
    const accreditationNumber = value(data.accreditationNumber, data.providerId);
    const additionalDeclaration = value(data.declaration, data.declarationText);
    const officeRemark = value(data.oremark);
    const invoiceDeclaration = value(data.invoiceno)
        ? `Exporter Invoice No. : ${value(data.invoiceno)}.`
        : '';

    const targetCommodity = !!data.targetCommodity || !!value(data.commodityDescription, data.marks, data.detail);
    const targetContainer = !!data.targetContainer || !!data.containers?.length;
    const targetPacking = !!data.targetPacking || !!value(data.packagingMaterial);
    const targetOther = value(data.other);
    const enclosureOther = value(data.fcd4);
    const prescribedDoseRate = value(data.f_doserate, data.doseRate);
    const prescribedDoseType = value(data.f_dosetype, 'g/m3');
    const exposurePeriod = value(data.f_duration, data.exposurePeriod);
    const prescribedTemp = value(data.f_temperature, data.temperature);
    const appliedDoseRate = value(data.f_doserate2, data.appliedDose);
    const appliedDoseType = value(data.f_dosetype2, 'g/m3');
    const appliedExposurePeriod = value(data.f_duration2, data.f_duration_hours, data.f_duration_days);
    const appliedTemp = value(data.f_temperature2, data.temperature);
    const commencedDate = formatDate(value(data.f_date, data.fumigationStarted));
    const commencedTime = value(data.f_starttime, data.f_time);
    const completedDate = formatDate(value(data.f_date_completed, data.fumigationCompleted));
    const completedTime = value(data.f_endtime);
    const finalTlvReading = value(data.ventilation, data.finalTlvReading, '00 PPM');
    const declarationText = value(data.declaration, data.declarationText);

    const textCell: React.CSSProperties = {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 11,
        color: '#000',
        lineHeight: '15px',
        verticalAlign: 'middle',
    };

    const bordered = (sides: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
        ...textCell,
        borderLeft: sides.includes('l') ? '1px solid #555' : undefined,
        borderRight: sides.includes('r') ? '1px solid #555' : undefined,
        borderTop: sides.includes('t') ? '1px solid #555' : undefined,
        borderBottom: sides.includes('b') ? '1px solid #555' : undefined,
        padding: '2px 5px',
        ...extra,
    });

    const labelCell = (extra: React.CSSProperties = {}) => bordered('l', {
        textAlign: 'right',
        paddingRight: 10,
        ...extra,
    });

    const sectionCell = (extra: React.CSSProperties = {}) => bordered('lt', {
        fontWeight: 700,
        paddingLeft: 10,
        textTransform: 'uppercase',
        ...extra,
    });

    const contentCell: React.CSSProperties = {
        ...textCell,
        padding: '2px 6px',
    };

    const leftLabelCell: React.CSSProperties = {
        ...contentCell,
        textAlign: 'right',
        paddingRight: 10,
        whiteSpace: 'nowrap',
    };

    const boxedCell = (extra: React.CSSProperties = {}): React.CSSProperties => ({
        ...textCell,
        border: '1px solid #555',
        padding: '2px 6px',
        textAlign: 'left',
        verticalAlign: 'middle',
        ...extra,
    });

    return (
        <div style={{ color: '#000', background: '#fff' }}>
            <style>
                {`
                    body { margin: 0; color: #000; background: #fff; }
                    @page { size: A4; margin: 0; }
                    .aus-print-wrap {
                        width: 210mm;
                        max-height: 297mm;
                        border-collapse: collapse;
                        margin: 0 auto;
                        font-family: Arial, Helvetica, sans-serif;
                        table-layout: fixed;
                    }
                    .aus-inner-table {
                        width: 100%;
                        border-collapse: collapse;
                        table-layout: fixed;
                        border: 1px solid #555;
                    }
                    .aus-checkbox {
                        display: inline-block;
                        width: 11px;
                        height: 11px;
                        border: 1px solid #222;
                        margin: 0 5px 0 0;
                        font-size: 9px;
                        line-height: 10px;
                        text-align: center;
                        vertical-align: -1px;
                        font-weight: 700;
                    }
                    .aus-target-table td,
                    .aus-schedule-table td,
                    .aus-fumigation-table td,
                    .aus-address-table td,
                    .aus-declaration-table td {
                        border: 1px solid #555;
                    }
                    .aus-shaded { background: #e3e3eb; }
                    .aus-top-space { height: 6mm; line-height: 6mm; font-size: 0; }
                    @media print {
                        .noprint { display: none; }
                        .aus-print-wrap {
                            width: 210mm !important;
                            max-height: 297mm !important;
                        }
                    }
                `}
            </style>

            <table className="aus-print-wrap" align="center" cellPadding={0} cellSpacing={0}>
                <tbody>
                    <tr>
                        <td style={{ width: '10mm' }} />
                        <td style={{ width: '190mm' }}>
                            <table className="aus-inner-table" cellPadding={0} cellSpacing={0} style={{ marginBottom: 0 }}>
                                <tbody>
                                    <tr>
                                        <td colSpan={2} align="left" style={{ ...textCell, fontWeight: 700, textDecoration: 'none' }}>
                                            <div className="aus-top-space">&nbsp;</div>
                                            711, 712 COMMODITY EXCHANGE BUILDING, SECTOR 19, VASHI, NAVI MUMBAI-400 703. MAHARASHTRA INDIA.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} align="left" style={{ ...textCell, fontSize: 14, fontWeight: 700 }}>
                                            <span>TREATMENT CERTIFICATE<strong> - METHYL BROMIDE FUMIGATION</strong></span>
                                            <span style={{ float: 'right' }}>Date Issued: <span style={{ fontWeight: 400 }}>{dateIssued}</span></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="50%" align="left" valign="middle" className="aus-shaded" style={bordered('ltr', { height: 32, paddingLeft: 10, lineHeight: '18px', fontSize: 13, fontWeight: 700 })}>
                                            Certificate number: {certificateNo}
                                        </td>
                                        <td align="left" valign="middle" className="aus-shaded" style={bordered('ltr', { height: 32, paddingLeft: 10, lineHeight: '18px', fontSize: 13, fontWeight: 700 })}>
                                            Treatment provider ID number: {providerId}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="aus-inner-table" cellPadding={0} cellSpacing={0} style={{ marginTop: 0 }}>
                                <colgroup>
                                    <col style={{ width: '30%' }} />
                                    <col style={{ width: '26%' }} />
                                    <col style={{ width: '22%' }} />
                                    <col style={{ width: '22%' }} />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <td colSpan={4} align="left" style={sectionCell()}><strong>CONSIGNMENT DETAILS</strong></td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ width: '30%', textAlign: 'right', paddingRight: 10 })}>
                                            Consignment Link<br /><span style={{ fontSize: 8 }}>(container numbers if applicable)</span>
                                        </td>
                                        <td colSpan={3} style={boxedCell({ height: 24 })}>{consignmentLink}</td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Client Name</td>
                                        <td colSpan={3} style={boxedCell()}>{clientName}</td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Client Address</td>
                                        <td colSpan={3} style={boxedCell({ height: 24 })}><span style={{ fontSize: 11 }}>{clientAddress}</span></td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Commodity Description</td>
                                        <td colSpan={3} style={boxedCell({ height: 24 })}><span style={{ fontSize: 11 }}>{commodityDescription}</span></td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Commodity Quantity</td>
                                        <td colSpan={3} style={boxedCell({ height: 22 })}><span style={{ fontSize: 11 }}>{commodityQuantity}</span></td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ textAlign: 'right', paddingRight: 10 })}><span style={{ fontSize: 11 }}>Commodity Country Of Origin</span></td>
                                        <td style={boxedCell()}>{countryOfOrigin}</td>
                                        <td style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Port of Loading</td>
                                        <td style={boxedCell()}>{portOfLoading}</td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Destination Country</td>
                                        <td style={boxedCell()}>{destinationCountry}</td>
                                        <td style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Seal Numbers(s)</td>
                                        <td style={boxedCell()}>{sealNumbers}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="aus-inner-table aus-target-table" cellPadding={0} cellSpacing={0} style={{ marginTop: 0 }}>
                                <tbody>
                                    <tr>
                                        <td colSpan={3} align="left" style={sectionCell()}><strong>TARGET OF FUMIGATION (pick all that apply)</strong></td>
                                        <td colSpan={3} align="left" style={sectionCell()}><strong>ENCLOSURE TYPE (pick one)</strong></td>
                                    </tr>
                                    <tr>
                                        <td width="16.66%" align="left" style={boxedCell()}><CheckBox checked={targetCommodity} />Commodity</td>
                                        <td width="16.66%" align="left" style={boxedCell()}><CheckBox checked={targetContainer} />Container</td>
                                        <td width="16.66%" align="left" style={boxedCell()}><CheckBox checked={targetPacking} />Packing</td>
                                        <td width="16.66%" align="left" style={boxedCell()}><CheckBox checked={!!data.fcd1} />Sheeted enclosure</td>
                                        <td width="16.66%" align="left" style={boxedCell()}><CheckBox checked={!!data.fcd2} />Fumigation chamber</td>
                                        <td width="16.66%" align="left" style={boxedCell()}><CheckBox checked={!!data.fcd3} />Un-sheeted container</td>
                                    </tr>
                                    <tr>
                                        <td align="left" colSpan={3} style={boxedCell()}><CheckBox checked={!!targetOther} />Other: {targetOther}</td>
                                        <td align="left" colSpan={3} style={boxedCell()}><CheckBox checked={!!enclosureOther} />Other: {enclosureOther}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="aus-inner-table aus-schedule-table" cellPadding={0} cellSpacing={0} style={{ marginTop: 0 }}>
                                <tbody>
                                    <tr>
                                        <td align="left" valign="middle" colSpan={3} style={sectionCell()}><strong>TREATMENT SCHEDULE (prescribed/specified treatment schedule)</strong></td>
                                    </tr>
                                    <tr className="aus-shaded">
                                        <td width="33.33%" style={boxedCell()}>Dose rate: &nbsp;&nbsp; {prescribedDoseRate} <span style={{ float: 'right' }}>({prescribedDoseType}) &nbsp;</span></td>
                                        <td width="33.33%" style={boxedCell()}>Exposure period: &nbsp;&nbsp; {exposurePeriod} <span style={{ float: 'right' }}>(HOURS) &nbsp;</span></td>
                                        <td width="33.33%" style={boxedCell()}>Temperature: &nbsp;&nbsp; {prescribedTemp} (<sup>O</sup>C) &nbsp; And Above</td>
                                    </tr>
                                    <tr>
                                        <td align="left" valign="middle" colSpan={3} style={sectionCell()}><strong>FUMIGATION DETAILS (treatment applied)</strong></td>
                                    </tr>
                                    <tr className="aus-shaded">
                                        <td style={boxedCell()}>Applied dose: &nbsp;&nbsp; {appliedDoseRate} <span style={{ float: 'right' }}>({appliedDoseType}) &nbsp;</span></td>
                                        <td style={boxedCell()}>Exposure period: &nbsp;&nbsp; {appliedExposurePeriod} <span style={{ float: 'right' }}>(HOURS) &nbsp;</span></td>
                                        <td style={boxedCell()}>Temperature: &nbsp;&nbsp; {appliedTemp} <span style={{ float: 'right' }}>(<sup>O</sup>C) &nbsp;</span></td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="aus-inner-table aus-fumigation-table" cellPadding={0} cellSpacing={0} style={{ marginTop: 0 }}>
                                <tbody>
                                    <tr>
                                        <td width="34%" rowSpan={3} align="right" valign="top" style={boxedCell({ textAlign: 'right', paddingTop: 5, paddingRight: 10 })}>Place of fumigation (Full address)</td>
                                        <td align="left" colSpan={2} style={boxedCell()}>Street address: {fumigationStreet}</td>
                                    </tr>
                                    <tr>
                                        <td align="left" colSpan={2} style={boxedCell()}>Suburb/town/city: {fumigationCity}</td>
                                    </tr>
                                    <tr>
                                        <td width="47%" align="left" style={boxedCell()}>Country: {fumigationCountry}</td>
                                        <td width="19%" align="left" style={boxedCell()}>Postcode: {fumigationPostcode}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Date and time fumigation commenced</td>
                                        <td colSpan={2} align="left" style={boxedCell()}>{commencedDate}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{commencedTime}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Date and time fumigation completed</td>
                                        <td colSpan={2} align="left" style={boxedCell()}>{completedDate}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{completedTime}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" style={boxedCell({ textAlign: 'right', paddingRight: 10 })}>Final TLV reading (ppm)</td>
                                        <td colSpan={2} align="left" style={boxedCell()}>{finalTlvReading}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="aus-inner-table aus-declaration-table" cellPadding={0} cellSpacing={0} style={{ marginTop: 0 }}>
                                <colgroup>
                                    <col style={{ width: '3%' }} />
                                    <col style={{ width: '4%' }} />
                                    <col style={{ width: '93%' }} />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <td align="left" valign="middle" colSpan={3} style={sectionCell()}><strong>DECLARATION</strong></td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={boxedCell()}>I, the fumigator-in-charge declare:</td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ borderRight: 'none' })} />
                                        <td align="center" valign="top" style={boxedCell({ borderLeft: 'none', borderRight: 'none', textAlign: 'center' })}>1.</td>
                                        <td style={boxedCell({ borderLeft: 'none', textAlign: 'left', paddingLeft: 8 })}>The fumigation certified was conducted in accordance with the treatment schedule, import conditions, and all the requirements in the Methyl Bromide Fumigation Methodology, and</td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ borderRight: 'none' })} />
                                        <td align="center" valign="top" style={boxedCell({ borderLeft: 'none', borderRight: 'none', textAlign: 'center' })}>2.</td>
                                        <td style={boxedCell({ borderLeft: 'none', textAlign: 'left', paddingLeft: 8 })}>The information I have provided is true and correct.</td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="aus-inner-table aus-declaration-table" cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    <tr>
                                        <td width="13%" height="30" align="right" valign="middle" style={boxedCell({ textAlign: 'right' })}>Signature&nbsp;</td>
                                        <td colSpan={3} align="left" valign="middle" style={boxedCell({ height: 30 })}><br /><br /><br /></td>
                                    </tr>
                                    <tr>
                                        <td align="right" valign="middle" style={boxedCell({ textAlign: 'right' })}>Full Name&nbsp;</td>
                                        <td colSpan={3} align="left" valign="middle" style={boxedCell()}>{fumigatorName}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" valign="middle" style={boxedCell({ textAlign: 'right' })}>Date&nbsp;</td>
                                        <td width="37%" align="left" valign="middle" style={boxedCell()}>{dateIssued}</td>
                                        <td width="18%" align="right" valign="middle" style={boxedCell({ textAlign: 'right' })}>Accreditation number&nbsp;</td>
                                        <td width="32%" align="left" valign="middle" style={boxedCell()}>{accreditationNumber}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td style={{ width: '10mm' }} />
                    </tr>
                    <tr>
                        <td style={{ width: '10mm' }} />
                        <td>
                            <table className="aus-inner-table aus-declaration-table" cellPadding={0} cellSpacing={0} style={{ marginTop: 0 }}>
                                <tbody>
                                    <tr>
                                        <td align="left" style={sectionCell()}><strong>ADDITIONAL DECLARATIONS</strong></td>
                                    </tr>
                                    <tr>
                                        <td style={boxedCell({ fontSize: 10, paddingLeft: 10, minHeight: 24 })}>
                                            {[invoiceDeclaration, declarationText, officeRemark].filter(Boolean).join(' ')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td style={{ width: '10mm' }} />
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AusPrint;
