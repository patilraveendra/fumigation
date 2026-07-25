import { type ChangeEvent, type FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CertificateData } from '../types/certificate';
import { generateCertificatePdf } from '../pdf/pdfService';
import { saveCertificate } from '../api/apiService';
import './CertificateForm.compact.css';

const initialData: CertificateData = {
    certificateType: 'MB',
    certificateNumber: '',
    dateIssued: '',
    providerId: '',
    accreditationNumber: '',
    clientName: '',
    clientAddress: '',
    exporterName: '',
    consigneeName: '',
    destinationCountry: '',
    portOfLoading: '',
    sealNumber: '',
    commodityDescription: '',
    commodityQuantity: '',
    netWeight: '',
    packagingMaterial: '',
    countryOfOrigin: '',
    shippingMark: '',
    fumigantName: '',
    placeOfFumigation: '',
    doseRate: '',
    appliedDose: '',
    exposurePeriod: '',
    durationFumigation: '',
    temperature: '',
    humidity: '',
    finalTlvReading: '',
    fumigationStarted: '',
    fumigationCompleted: '',
    gasTightSheets: 'Yes',
    declarationText: '',
    invoiceNumber: '',
    invoiceDate: '',
    fumigatorName: '',
    // Additional fields from legacy MB form (optional)
    tc_country: '',
    noOfQuantity: '0',
    targetCommodity: false,
    targetContainer: false,
    targetPacking: false,
    detail: '',
    ct20: '',
    ct40: '',
    containers: [],
    quantityDeclared: '',
    marks: '',
    l_ship: '',
    d_name: '',
    d_address: '',
    c_name: '',
    c_address: '',
    notify: '',
    // AUS-specific fields
    workOrder: '',
    other: '',
    consignmentLink: '',
    placeAddress: '',
    placeCity: '',
    placeCountry: '',
    placePostcode: '',
    f_starttime: '',
    f_endtime: '',
    f_type: '',
    f_date: '',
    f_date_completed: '',
    f_time: '',
    f_place: '',
    f_doserate: '',
    f_dosetype: '',
    f_doserate2: '',
    f_dosetype2: '',
    f_duration: '',
    f_duration2: '',
    f_duration_days: '',
    f_duration_hours: '',
    f_hour: '',
    f_temperature: '',
    f_temperature2: '',
    f_ttype: '',
    f_performed: 'Yes',
    f_airspace: 'N/A',
    fcd1: false,
    fcd2: false,
    fcd3: false,
    fcd4: '',
    ventilation: '',
    fcoi: '',
    phnph: '',
    cnoat: '',
    declaration: '',
    oremark: '',
    invoiceno: '',
};

const mbFumigantOptions = [
    'Methyl Bromide',
    'Methyl Bromide',
    'Methyl Bromide (MBR)',
    'Methyl Bromide (MB)',
    'Methyl Bromide (CH3BR)',
];

const alpFumigantOptions = [
    'Aluminium Phosphide',
    'Aluminium Phosphine',
    'Aluminium Phosphide 56%',
    'PHOSPHINE (PH3)',
    'PHOSPHINE',
    'ALUMINIUM PHOSPHIDE (PHOSPHINE)',
    'FOSFAMINA (Aluminium Phosphide)',
];

const mbDosageTypeOptions = [
    { value: 'GRMS /CU.M', label: 'GRMS /CU.M' },
    { value: 'GRMS /CU.M', label: 'GRMS /CU.M' },
    { value: 'GMS/M3', label: 'GMS/M3' },
    { value: 'GRAMS /CU.M', label: 'GRAMS /CU.M' },
    { value: 'GRAMS/M3', label: 'GRAMS/M3' },
    { value: 'LBS Per 1000 CubiK Feet', label: 'LBS Per 1000 Cubik Feet' },
    { value: 'GRMS/M3', label: 'GRMS/M3' },
    { value: 'GRAMS/M3', label: 'GRAMS/M3' },
    { value: ' ', label: '\u00a0\u00a0' },
];

const alpDosageTypeOptions = [
    { value: 'Gram/MT', label: 'Gram/MT' },
    { value: 'Gram/MT', label: 'Gram/MT' },
    { value: 'MG/M3', label: 'MG/M3' },
    { value: 'GRAMS/M3(4 GRAMS(PH3))', label: 'GRAMS/M3(4 GRAMS(PH3))' },
    { value: 'GRAMS/TON', label: 'GRAMS/TON' },
    { value: 'LBS Per 1000 Cubic Feet', label: 'LBS Per 1000 Cubic Feet' },
    { value: 'GR/M3', label: 'GR/M3' },
    { value: 'GRMS/M3', label: 'GRMS/M3' },
    { value: 'GRAMS/M3', label: 'GRAMS/M3' },
    { value: 'Gram Per Cum', label: 'Gram Per Cum' },
    { value: 'Tablets per MT', label: 'Tablets per MT' },
    { value: 'TABLETS/M3', label: 'TABLETS/M3' },
    { value: '100 m<sup>3</sup>', label: '100 m\u00b3' },
    { value: 'gm/100 m<sup>3</sup>', label: 'gm/100 m\u00b3' },
];

const mbDurationUnitOptions = [
    { value: 'HOURS', label: 'HOURS' },
    { value: 'hours', label: 'hours' },
];

const alpDurationUnitOptions = [
    { value: 'Days', label: 'Days' },
    { value: 'DAYS', label: 'DAYS' },
    { value: 'Hours', label: 'Hours' },
    { value: 'HOURS', label: 'HOURS' },
];

function formatAlpDuration(days?: string, hours?: string) {
    const cleanDays = days?.trim() ?? '';
    const cleanHours = hours?.trim() ?? '';

    if (cleanDays && cleanHours) {
        return `${cleanDays} Days [${cleanHours} Hours]`;
    }

    if (cleanDays) {
        return `${cleanDays} Days`;
    }

    if (cleanHours) {
        return `${cleanHours} Hours`;
    }

    return '';
}

interface CertificateFormProps {
    onLogout?: () => void;
    onViewSaved?: () => void;
    initialType?: 'MB' | 'ALP' | 'AUS';
    initialValues?: Partial<CertificateData>;
}

function AUSCertificateForm({ onLogout, onViewSaved, initialType, initialValues }: CertificateFormProps) {
    const [data, setData] = useState<CertificateData>({
        ...initialData,
        ...initialValues,
        certificateType: initialType ?? initialValues?.certificateType ?? initialData.certificateType,
    });
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [containers, setContainers] = useState<Array<{ cont?: string; seal?: string }>>(data.containers ?? []);
    const isMb = data.certificateType === 'MB';

    useEffect(() => {
        try {
            sessionStorage.setItem('printData', JSON.stringify(data));
        } catch (err) {
            // ignore
        }
    }, [data.cnoat, data.containers]);

    const addContainer = () => {
        setContainers((prev) => {
            const next = [...prev, { cont: '', seal: '' }];
            setData((d) => ({ ...d, containers: next } as CertificateData));
            return next;
        });
    };

    const updateContainer = (index: number, field: 'cont' | 'seal', value: string) => {
        setContainers((prev) => {
            const next = prev.map((c, i) => (i === index ? { ...c, [field]: value } : c));
            setData((d) => ({ ...d, containers: next } as CertificateData));
            return next;
        });
    };

    const removeContainer = (index: number) => {
        setContainers((prev) => {
            const next = prev.filter((_, i) => i !== index);
            setData((d) => ({ ...d, containers: next } as CertificateData));
            return next;
        });
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const name = event.target.name as keyof CertificateData;
        const value = event.target.value;

        if (name === 'certificateType') {
            const nextFumigantOptions = value === 'ALP' || value === 'AUS' ? alpFumigantOptions : mbFumigantOptions;
            const nextDosageOptions = value === 'ALP' || value === 'AUS' ? alpDosageTypeOptions : mbDosageTypeOptions;

            setData((prev) => ({
                ...prev,
                certificateType: value,
                f_type: nextFumigantOptions.includes(prev.f_type ?? '') ? prev.f_type : nextFumigantOptions[0],
                f_dosetype: nextDosageOptions.some((option) => option.value === prev.f_dosetype) ? prev.f_dosetype : nextDosageOptions[0].value,
                f_hour: value === 'ALP' || value === 'AUS'
                    ? ''
                    : (mbDurationUnitOptions.some((option) => option.value === prev.f_hour) ? prev.f_hour : mbDurationUnitOptions[0].value),
            } as CertificateData));
            return;
        }

        const inputValue = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;

        if (name === 'f_duration' || name === 'durationFumigation') {
            setData((prev) => ({
                ...prev,
                f_duration: inputValue as string,
                durationFumigation: inputValue as string,
            } as CertificateData));
            return;
        }

        if (name === 'f_duration_days' || name === 'f_duration_hours') {
            setData((prev) => {
                const nextDays = name === 'f_duration_days' ? value : prev.f_duration_days;
                const nextHours = name === 'f_duration_hours' ? value : prev.f_duration_hours;
                const nextDuration = formatAlpDuration(nextDays, nextHours);

                return {
                    ...prev,
                    [name]: value,
                    f_duration: nextDuration,
                    durationFumigation: nextDuration,
                    f_hour: '',
                } as CertificateData;
            });
            return;
        }

        setData((prev) => ({
            ...prev,
            [name]: inputValue,
        } as CertificateData));
    };

    const handleGeneratePdf = async () => {
        setSaveStatus(null);
        let toSave: CertificateData;
        try {
            // Ensure latest container state is used when generating/saving
            toSave = { ...data, containers } as CertificateData;
            // sync main data state with containers before actions
            setData(toSave);
            console.debug('Saving certificate payload:', toSave);
            if (toSave.certificateType === 'AUS') {
                try {
                    sessionStorage.setItem('printData', JSON.stringify(toSave));
                    localStorage.setItem('printData', JSON.stringify(toSave));
                } catch {
                    // ignore storage failures
                }
                window.open('/print', '_blank', 'noopener,noreferrer');
            } else {
                await generateCertificatePdf(toSave);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setSaveStatus(`PDF generation failed: ${message}`);
            console.error('PDF generation error:', error);
            return;
        }
        setIsSaving(true);
        try {
            // use the synced `toSave` payload to ensure latest fields (like cnoat) are persisted
            await saveCertificate(toSave);
            setSaveStatus('Certificate saved successfully.');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            setSaveStatus(`Save failed: ${message}`);
        } finally {
            setIsSaving(false);
        }
    };
    const handleSaveCertificate = async () => {
        setIsSaving(true);
        setSaveStatus(null);

        try {
            const response = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || response.statusText);
            }

            setSaveStatus('Certificate saved successfully.');
        } catch (error) {
            setSaveStatus(`Failed to save certificate: ${(error as Error).message}`);
        } finally {
            setIsSaving(false);
        }
    };
    const navigate = useNavigate();

    return (
        <div className="page-shell container-fluid">
            <div className="row align-items-center mb-4">
                <div className="col">
                    <p className="text-muted mb-1">Phase 1 MVP</p>
                    <h2 className="mb-0">Fumigation Certificate Generator</h2>
                    <p className="text-muted">Enter the details below, then generate a fixed-layout PDF.</p>
                </div>
                <div className="col-auto">
                    {onViewSaved ? (
                        <button type="button" className="btn btn-outline-secondary me-2" onClick={onViewSaved}>
                            View saved certificates
                        </button>
                    ) : null}
                    {onLogout ? (
                        <button type="button" className="btn btn-outline-secondary" onClick={onLogout}>
                            Logout
                        </button>
                    ) : null}
                </div>
            </div>

            <form className="compact-form" onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
                {data.certificateType === 'MB' && (
                    <div className="mb-2">
                        <h5 className="mb-1">MB Form Creation</h5>
                    </div>
                )}
                <div className="row">
                    <div className="col-12">
                        <div className="card mb-3">
                            <div className="card-header">Certificate Details</div>
                            <div className="card-body">
                                <div className="certificate-inline-row">
                                    <div className="field-type">
                                        <label className="form-label mb-0">Certificate Type</label>
                                        <div className="form-control-plaintext ms-2 mb-0">{data.certificateType}</div>
                                        <input type="hidden" name="certificateType" value={data.certificateType} />
                                    </div>
                                    <div className="field-number">
                                        <label className="form-label">Certificate Number</label>
                                        <input type="text" name="certificateNumber" value={data.certificateNumber} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="field-date">
                                        <label className="form-label">Date Issued</label>
                                        <input type="date" name="dateIssued" value={data.dateIssued} onChange={handleInputChange} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {data.certificateType === 'AUS' ? (
                                <>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">DPPQS Registration No</label>
                                            <input
                                                type="text"
                                                name="providerId"
                                                value={data.providerId}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Work Order</label>
                                            <input
                                                type="text"
                                                name="workOrder"
                                                value={data.workOrder ?? ''}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mt-3">
                                        <div className="col-12 text-center" style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
                                            TARGET OF FUMIGATION DETAIL
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="d-flex flex-wrap gap-3 align-items-center">
                                                <label className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="targetCommodity" checked={!!data.targetCommodity} onChange={handleInputChange} />
                                                    <span className="form-check-label">Commodity</span>
                                                </label>
                                                <label className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="targetContainer" checked={!!data.targetContainer} onChange={handleInputChange} />
                                                    <span className="form-check-label">Container</span>
                                                </label>
                                                <label className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="targetPacking" checked={!!data.targetPacking} onChange={handleInputChange} />
                                                    <span className="form-check-label">Packing</span>
                                                </label>
                                                <div className="d-flex align-items-center gap-2">
                                                    <label className="form-label mb-0">Other:</label>
                                                    <input type="text" name="other" value={data.other} onChange={handleInputChange} className="form-control" style={{ maxWidth: 240 }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">* Commodity</label>
                                            <textarea name="commodityDescription" value={data.commodityDescription} onChange={handleInputChange} className="form-control" rows={4} />
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label">* Quantity declared</label>
                                                    <input type="text" name="quantityDeclared" value={data.quantityDeclared} onChange={handleInputChange} className="form-control" />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label">* No Of Quantity</label>
                                                    <input type="number" name="noOfQuantity" value={data.noOfQuantity} onChange={handleInputChange} className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Consignment Link</label>
                                            <input type="text" name="consignmentLink" value={data.consignmentLink} onChange={handleInputChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">* Country of origin</label>
                                            <input type="text" name="countryOfOrigin" value={data.countryOfOrigin} onChange={handleInputChange} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">* Port of Loading</label>
                                            <input type="text" name="portOfLoading" value={data.portOfLoading} onChange={handleInputChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">* Country of Destination</label>
                                            <input type="text" name="destinationCountry" value={data.destinationCountry} onChange={handleInputChange} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">* Name of Exporter</label>
                                            <input type="text" name="d_name" value={data.d_name} onChange={handleInputChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">* Exporter Invoice No</label>
                                            <input type="text" name="invoiceno" value={data.invoiceno} onChange={handleInputChange} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Name of Exporter</label>
                                            <input type="text" name="exporterName" value={data.exporterName} onChange={handleInputChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Address of Exporter</label>
                                            <textarea name="d_address" value={data.d_address} onChange={handleInputChange} className="form-control" rows={3} />
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Place Address</label>
                                            <input type="text" name="placeAddress" value={data.placeAddress} onChange={handleInputChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Place City</label>
                                            <input type="text" name="placeCity" value={data.placeCity} onChange={handleInputChange} className="form-control" />
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Place Country</label>
                                            <input type="text" name="placeCountry" value={data.placeCountry} onChange={handleInputChange} className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Place Postcode</label>
                                            <input type="text" name="placePostcode" value={data.placePostcode} onChange={handleInputChange} className="form-control" />
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                {data.certificateType === 'AUS' ? null : (
                                    <>
                                        <div className="col-md-4">
                                            <label className="form-label">Country</label>
                                            <input
                                                type="text"
                                                name="tc_country"
                                                value={data.tc_country}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">No Of Quantity</label>
                                            <input
                                                type="number"
                                                name="noOfQuantity"
                                                value={data.noOfQuantity}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Work Order</label>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary w-100"
                                                onClick={() => {
                                                    const wo = prompt('Enter Work Order or leave blank');
                                                    if (wo !== null) {
                                                        setData(prev => ({ ...prev, workOrder: wo } as CertificateData));
                                                    }
                                                }}
                                            >
                                                Select / Edit
                                            </button>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Exporter Name</label>
                                            <input
                                                type="text"
                                                name="exporterName"
                                                value={data.exporterName}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-12">
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <div>
                                                    <label className="form-label">Exporter Invoice No & Date</label>
                                                    <input
                                                        type="text"
                                                        name="invoiceno"
                                                        value={data.invoiceno}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />

                                                    <label className="form-label mt-3">Exporter Address</label>
                                                    <textarea
                                                        name="d_address"
                                                        value={data.d_address}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        rows={3}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Consignee Name</label>
                                                    <input
                                                        type="text"
                                                        name="consigneeName"
                                                        value={data.consigneeName}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />

                                                    <label className="form-label mt-3">Address of Consignee</label>
                                                    <textarea
                                                        name="c_address"
                                                        value={data.c_address}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {data.certificateType === 'AUS' ? (
                        <div className="card mb-3">
                            <div className="card-header">Treatment Details</div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Date of Fumigation Commenced</label>
                                        <input type="date" name="f_date" value={data.f_date || data.fumigationStarted} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Time of Fumigation Commenced</label>
                                        <input type="text" name="f_starttime" value={data.f_starttime} onChange={handleInputChange} className="form-control" placeholder="HH:MM AM/PM" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Date of Fumigation Completed</label>
                                        <input type="date" name="f_date_completed" value={data.f_date_completed} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Time of Fumigation Completed</label>
                                        <input type="text" name="f_endtime" value={data.f_endtime} onChange={handleInputChange} className="form-control" placeholder="HH:MM AM/PM" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">* DAWR prescribed dose rate (g/m<sup>3</sup>)</label>
                                        <div className="d-flex gap-2 align-items-center">
                                            <input type="text" name="f_doserate" value={data.f_doserate} onChange={handleInputChange} className="form-control" />
                                            <select name="f_dosetype" value={data.f_dosetype} onChange={handleInputChange} className="form-select" style={{ maxWidth: 160 }}>
                                                <option value=""></option>
                                                {alpDosageTypeOptions.map((option, index) => (
                                                    <option key={`${option.value}-${index}`} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">* Exposure period (hrs)</label>
                                        <div className="d-flex gap-2 align-items-center">
                                            <input type="text" name="f_duration" value={data.f_duration} onChange={handleInputChange} className="form-control" />
                                            <span>HOURS</span>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">* Forecast minimum temp (C)</label>
                                        <div className="d-flex gap-2 align-items-center">
                                            <input type="text" name="f_temperature" value={data.f_temperature} onChange={handleInputChange} className="form-control" />
                                            <span>DEG. CELSIUS</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">* Applied Dosage rate (g/m<sup>3</sup>)</label>
                                        <div className="d-flex gap-2 align-items-center">
                                            <input type="text" name="f_doserate2" value={data.f_doserate2} onChange={handleInputChange} className="form-control" />
                                            <select name="f_dosetype2" value={data.f_dosetype2} onChange={handleInputChange} className="form-select" style={{ maxWidth: 160 }}>
                                                <option value=""></option>
                                                {alpDosageTypeOptions.map((option, index) => (
                                                    <option key={`${option.value}-${index}`} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Exposure period (hrs)</label>
                                        <div className="d-flex gap-2 align-items-center">
                                            <input type="text" name="f_duration2" value={data.f_duration2} onChange={handleInputChange} className="form-control" />
                                            <span>HOURS</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Forecast minimum temp (C)</label>
                                        <div className="d-flex gap-2 align-items-center">
                                            <input type="text" name="f_temperature2" value={data.f_temperature2} onChange={handleInputChange} className="form-control" />
                                            <span>DEG. CELSIUS</span>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">* Enclosure Type</label>
                                        <div className="d-flex flex-wrap gap-3 align-items-center">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="fcd1" checked={!!data.fcd1} onChange={handleInputChange} id="fcd1" />
                                                <label className="form-check-label" htmlFor="fcd1">Sheeted enclosure</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="fcd2" checked={!!data.fcd2} onChange={handleInputChange} id="fcd2" />
                                                <label className="form-check-label" htmlFor="fcd2">Fumigation chamber</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="fcd3" checked={!!data.fcd3} onChange={handleInputChange} id="fcd3" />
                                                <label className="form-check-label" htmlFor="fcd3">Un-sheeted container</label>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <label className="form-label mb-0">Other:</label>
                                                <input type="text" name="fcd4" value={data.fcd4} onChange={handleInputChange} className="form-control" style={{ maxWidth: 240 }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label mb-0">Consignment Link / Container No</label>
                                            <button type="button" className="btn btn-info btn-sm" onClick={addContainer}>Click To Add Container Number</button>
                                        </div>
                                        {containers.length === 0 ? null : containers.map((c, idx) => (
                                            <div key={idx} className="row g-2 mb-2 align-items-center">
                                                <div className="col-md-5">
                                                    <input placeholder="Container No" value={c.cont || ''} onChange={(e) => updateContainer(idx, 'cont', e.target.value)} className="form-control" />
                                                </div>
                                                <div className="col-md-5">
                                                    <input placeholder="Seal No" value={c.seal || ''} onChange={(e) => updateContainer(idx, 'seal', e.target.value)} className="form-control" />
                                                </div>
                                                <div className="col-md-2">
                                                    <button type="button" className="btn btn-danger btn-sm w-100" onClick={() => removeContainer(idx)}>Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">* Ventilation Final TLV reading(ppm)</label>
                                        <input type="text" name="ventilation" value={data.ventilation} onChange={handleInputChange} className="form-control" />
                                        <small className="text-muted">(not required for Stack or Permanent Chamber fumigation)</small>
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">* Container No. Place</label>
                                        <select name="cnoat" value={data.cnoat} onChange={handleInputChange} className="form-select">
                                            <option value="">Select</option>
                                            <option value="In Additional Declaration">In Additional Declaration</option>
                                            <option value="As Per Format">As Per Format</option>
                                            <option value="In Additional Declaration - Attachment">In Additional Declaration - Attachment</option>
                                            <option value="As Per Format - Attachment">As Per Format - Attachment</option>
                                            <option value="As Per Format - Hide Numbers">As Per Format - Hide Numbers</option>
                                            <option value="As per Bill of Lading">As per Bill of Lading</option>
                                        </select>
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">* Additional Declaration</label>
                                        <textarea name="declaration" value={data.declaration} onChange={handleInputChange} className="form-control" rows={4} />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Office Remark</label>
                                        <textarea name="oremark" value={data.oremark} onChange={handleInputChange} className="form-control" rows={3} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card mb-3">
                            <div className="card-header">Treatment Details</div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Name of Fumigation</label>
                                        <select name="f_type" value={data.f_type} onChange={handleInputChange} className="form-select">
                                            <option value=""></option>
                                            {(isMb ? mbFumigantOptions : alpFumigantOptions).map((option, index) => (
                                                <option key={`${option}-${index}`} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Place of Fumigation</label>
                                        <input type="text" name="placeOfFumigation" value={data.placeOfFumigation} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Dosage rate of Fumigation</label>
                                        <div className="d-flex gap-2">
                                            <input type="text" name="f_doserate" value={data.f_doserate} onChange={handleInputChange} className="form-control" />
                                            <select name="f_dosetype" value={data.f_dosetype} onChange={handleInputChange} className="form-select" style={{ maxWidth: 160 }}>
                                                <option value=""></option>
                                                {(isMb ? mbDosageTypeOptions : alpDosageTypeOptions).map((option, index) => (
                                                    <option key={`${option.value}-${index}`} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-3 mt-2">
                                    <div className="col-md-4">
                                        <label className="form-label">Duration of Fumigation</label>
                                        {isMb ? (
                                            <div className="d-flex gap-2">
                                                <input type="text" name="f_duration" value={data.f_duration || data.durationFumigation} onChange={handleInputChange} className="form-control" />
                                                <select name="f_hour" value={data.f_hour} onChange={handleInputChange} className="form-select" style={{ maxWidth: 120 }}>
                                                    <option value=""></option>
                                                    {mbDurationUnitOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="d-flex gap-2 align-items-center">
                                                <input type="text" name="f_duration_days" value={data.f_duration_days} onChange={handleInputChange} className="form-control" />
                                                <span>Days</span>
                                                <input type="text" name="f_duration_hours" value={data.f_duration_hours} onChange={handleInputChange} className="form-control" />
                                                <span>Hours</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-4">
                                        {isMb ? (
                                            <>
                                                <label className="form-label">Minimum air temperature</label>
                                                <div className="d-flex gap-2">
                                                    <input type="text" name="f_temperature" value={data.f_temperature || data.temperature} onChange={handleInputChange} className="form-control" />
                                                    <select name="f_ttype" value={data.f_ttype} onChange={handleInputChange} className="form-select" style={{ maxWidth: 160 }}>
                                                        <option value=""></option>
                                                        <option value="DEG. CELSIUS">DEG. CELSIUS</option>
                                                        <option value="DEG. CELSIUS">DEG. CELSIUS</option>
                                                    </select>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <label className="form-label">Average Ambient Humidity</label>
                                                <div className="d-flex gap-2 align-items-center">
                                                    <input type="text" name="humidity" value={data.humidity} onChange={handleInputChange} className="form-control" style={{ maxWidth: 120 }} />
                                                    <span>%</span>
                                                    <input type="text" name="temperature" value={data.temperature} onChange={handleInputChange} className="form-control" style={{ maxWidth: 100 }} />
                                                    <span>°C</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Date of Fumigation</label>
                                        <input type="date" name="f_date" value={data.f_date || data.fumigationStarted} onChange={handleInputChange} className="form-control" />
                                    </div>
                                </div>
                                <div className="row g-3 mt-3">
                                    <>
                                        <div className="col-md-4">
                                            <label className="form-label">Fumigation Performed Under gastight sheets</label>
                                            <select name="f_performed" value={data.f_performed} onChange={handleInputChange} className="form-select">
                                                <option value=""></option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Container has 200mm free air space at top of container</label>
                                            <select name="f_airspace" value={data.f_airspace} onChange={handleInputChange} className="form-select">
                                                <option value=""></option>
                                                <option value="N/A">N/A</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </>
                                    {isMb ? (
                                        <div className="col-md-4">
                                            <label className="form-label">Fumigation Carried Out In</label>
                                            <select name="fcoi" value={data.fcoi} onChange={handleInputChange} className="form-select">
                                                <option value=""></option>
                                                <option value="NSPM 12 AND ISPM 15 REGULATION OF IPPC">NSPM 12 AND ISPM 15 REGULATION OF IPPC</option>
                                                <option value="NSPM 12">NSPM 12</option>
                                            </select>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="card mb-3">
                        <div className="card-header">Operator Details</div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Fumigator Name / Accreditation Number</label>
                                <input type="text" name="fumigatorName" value={data.fumigatorName} onChange={handleInputChange} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header">Additional Information</div>
                        <div className="card-body">
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Category</label>
                                    <select name="phnph" value={data.phnph} onChange={handleInputChange} className="form-select">
                                        <option value=""></option>
                                        <option value="Non-Phyto">Non-Phyto</option>
                                        <option value="Phyto">Phyto</option>
                                    </select>
                                </div>

                            </div>

                            <div className="mb-3">
                                <label className="form-label">Additional Declaration</label>
                                <textarea name="declaration" value={data.declaration} onChange={handleInputChange} className="form-control" rows={4} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Office Remark</label>
                                <textarea name="oremark" value={data.oremark} onChange={handleInputChange} className="form-control" rows={3} />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-end mb-4">
                        <button type="button" className="btn btn-success" onClick={handleSaveCertificate} disabled={isSaving}>
                            {isSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button type="button" className="btn btn-outline-primary" onClick={() => {
                            try {
                                try { sessionStorage.setItem('printData', JSON.stringify(data)); } catch { }
                                try { localStorage.setItem('printData', JSON.stringify(data)); } catch { }
                                window.open('/print', '_blank');
                            } catch (err) {
                                setSaveStatus('Failed to open print view.');
                            }
                        }}>Open Print View</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => (onViewSaved ? onViewSaved() : navigate('/list'))}>View saved certificates</button>
                    </div>
                    {saveStatus ? (
                        <div className="form-status">
                            <p>{saveStatus}</p>
                        </div>
                    ) : null}
                </div>
            </form>
        </div>
    );
}

export default AUSCertificateForm;
