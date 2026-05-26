import { type ChangeEvent, type FormEvent, useState } from 'react';
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
    f_type: '',
    f_date: '',
    f_place: '',
    f_doserate: '',
    f_dosetype: '',
    f_duration: '',
    f_hour: '',
    f_temperature: '',
    f_ttype: '',
    f_performed: 'Yes',
    f_airspace: 'N/A',
    fcoi: '',
    phnph: '',
    cnoat: '',
    declaration: '',
    oremark: '',
    invoiceno: '',
};

interface CertificateFormProps {
    onLogout?: () => void;
    onViewSaved?: () => void;
    initialType?: 'MB' | 'ALP';
    initialValues?: Partial<CertificateData>;
}

function CertificateForm({ onLogout, onViewSaved, initialType, initialValues }: CertificateFormProps) {
    const [data, setData] = useState<CertificateData>({
        ...initialData,
        ...initialValues,
        certificateType: initialType ?? initialValues?.certificateType ?? initialData.certificateType,
    });
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [containers, setContainers] = useState<Array<{ cont?: string; seal?: string }>>(data.containers ?? []);
    const isMb = data.certificateType === 'MB';

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
        setData((prev) => ({
            ...prev,
            [name]: value,
        } as CertificateData));
    };

    const handleGeneratePdf = async () => {
        setSaveStatus(null);
        try {
            await generateCertificatePdf(data);
        } catch (error) {
            setSaveStatus('PDF generation failed.');
            return;
        }
        setIsSaving(true);
        try {
            await saveCertificate(data);
            setSaveStatus('Certificate saved successfully.');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            setSaveStatus(`Save failed: ${message}`);
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

            <form onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card mb-3">
                            <div className="card-header">Certificate Details</div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Certificate Type</label>
                                        {initialType === 'MB' ? (
                                            <div className="form-control-plaintext">MB</div>
                                        ) : (
                                            <select name="certificateType" value={data.certificateType} onChange={handleInputChange} className="form-select">
                                                <option value="MB">MB</option>
                                                <option value="ALP">ALP</option>
                                            </select>
                                        )}
                                        <input type="hidden" name="certificateType" value={data.certificateType} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Certificate Number</label>
                                        <input type="text" name="certificateNumber" value={data.certificateNumber} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Date Issued</label>
                                        <input type="date" name="dateIssued" value={data.dateIssued} onChange={handleInputChange} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <div className="card-header">Client / Shipment Details</div>
                            <div className="card-body">
                                <div className="row g-3 mb-2">
                                    <div className="col-md-4">
                                        <label className="form-label">Country</label>
                                        <input type="text" name="tc_country" value={data.tc_country} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">No Of Quantity</label>
                                        <input type="number" name="noOfQuantity" value={data.noOfQuantity} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Work Order</label>
                                        <div>
                                            <button type="button" className="btn btn-outline-secondary">Select / Edit</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3 mb-2">
                                    <div className="col-md-4">
                                        <label className="form-label">Exporter Name</label>
                                        <input type="text" name="exporterName" value={data.exporterName} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Consignee Name</label>
                                        <input type="text" name="consigneeName" value={data.consigneeName} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Type and Description of Cargo</label>
                                        <input type="text" name="commodityDescription" value={data.commodityDescription} onChange={handleInputChange} className="form-control" />
                                    </div>
                                </div>

                                <div className="row g-3 mb-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Exporter Invoice No &amp; Date</label>
                                        <input type="text" name="invoiceno" value={data.invoiceno} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Exporter Address</label>
                                        <textarea name="d_address" value={data.d_address} onChange={handleInputChange} className="form-control" rows={3} />
                                    </div>
                                </div>

                                <div className="row g-3 mb-2">
                                    <div className="col-md-12">
                                        <label className="form-label">Address of Consignee</label>
                                        <textarea name="c_address" value={data.c_address} onChange={handleInputChange} className="form-control" rows={3} />
                                    </div>
                                </div>

                                <div className="row g-3 mb-2">
                                    <div className="col-md-12">
                                        <label className="form-label">NOTIFY PARTY</label>
                                        <textarea name="notify" value={data.notify} onChange={handleInputChange} className="form-control" rows={2} />
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label">Commodity Quantity</label>
                                        <input type="text" name="commodityQuantity" value={data.commodityQuantity} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Net Weight</label>
                                        <input type="text" name="netWeight" value={data.netWeight} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Packaging Material</label>
                                        <input type="text" name="packagingMaterial" value={data.packagingMaterial} onChange={handleInputChange} className="form-control" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Shipping Mark / Brand</label>
                                        <input type="text" name="shippingMark" value={data.shippingMark} onChange={handleInputChange} className="form-control" />
                                    </div>
                                </div>


                                <div className="row g-3 mt-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Quantity Declared</label>
                                        <textarea name="quantityDeclared" value={data.quantityDeclared} onChange={handleInputChange} className="form-control" rows={4} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Type and description of cargo</label>
                                        <textarea name="marks" value={data.marks} onChange={handleInputChange} className="form-control" rows={4} />
                                    </div>
                                </div>

                                <div className="row g-3 mb-2 align-items-end mt-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Container Types</label>
                                        <div className="d-flex gap-2">
                                            <div style={{ minWidth: 160 }}>
                                                <label className="form-label small">20' X</label>
                                                <select name="ct20" value={data.ct20} onChange={handleInputChange} className="form-select">
                                                    <option value="">Select When Required</option>
                                                    <option value="FCL">FCL</option>
                                                    <option value="LCL">LCL</option>
                                                </select>
                                            </div>
                                            <div style={{ minWidth: 160 }}>
                                                <label className="form-label small">40' X</label>
                                                <select name="ct40" value={data.ct40} onChange={handleInputChange} className="form-select">
                                                    <option value="">Select When Required</option>
                                                    <option value="FCL">FCL</option>
                                                    <option value="LCL">LCL</option>
                                                    <option value="HC">HC</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-end">
                                        <label className="form-label">Container No / Seal No</label>
                                        <div>
                                            <button type="button" className="btn btn-info btn-sm" onClick={addContainer}>Add Container</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    {containers.map((c, idx) => (
                                        <div key={idx} className="d-flex gap-2 align-items-center mb-2">
                                            <input placeholder="Container No" value={c.cont || ''} onChange={(e) => updateContainer(idx, 'cont', e.target.value)} className="form-control" style={{ maxWidth: 220 }} />
                                            <input placeholder="Seal No" value={c.seal || ''} onChange={(e) => updateContainer(idx, 'seal', e.target.value)} className="form-control" style={{ maxWidth: 140 }} />
                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => removeContainer(idx)}>Delete</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <div className="card-header">Treatment Details</div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Name of Fumigation</label>
                                        <select name="f_type" value={data.f_type} onChange={handleInputChange} className="form-select">
                                            <option value="Methyl Bromide">Methyl Bromide</option>
                                            <option value="Methyl Bromide (MBR)">Methyl Bromide (MBR)</option>
                                            <option value="Methyl Bromide (MB)">Methyl Bromide (MB)</option>
                                            <option value="Methyl Bromide (CH3BR)">Methyl Bromide (CH3BR)</option>
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
                                                <option value="GRMS /CU.M">GRMS /CU.M</option>
                                                <option value="GMS/M3">GMS/M3</option>
                                                <option value="GRAMS /CU.M">GRAMS /CU.M</option>
                                                <option value="LBS Per 1000 CubiK Feet">LBS Per 1000 Cubik Feet</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-3 mt-2">
                                    <div className="col-md-4">
                                        <label className="form-label">Duration of Fumigation</label>
                                        <div className="d-flex gap-2">
                                            <input type="text" name="durationFumigation" value={data.durationFumigation} onChange={handleInputChange} className="form-control" />
                                            <select name="f_hour" value={data.f_hour} onChange={handleInputChange} className="form-select" style={{ maxWidth: 120 }}>
                                                <option value="hours">hours</option>
                                                <option value="HOURS">HOURS</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        {isMb ? (
                                            <>
                                                <label className="form-label">Minimum air temperature</label>
                                                <div className="d-flex gap-2">
                                                    <input type="text" name="f_temperature" value={data.f_temperature || data.temperature} onChange={handleInputChange} className="form-control" />
                                                    <select name="f_ttype" value={data.f_ttype} onChange={handleInputChange} className="form-select" style={{ maxWidth: 160 }}>
                                                        <option value="DEG. CELSIUS">DEG. CELSIUS</option>
                                                        <option value="DEG. CELSIUS">DEG. CELSIUS</option>
                                                    </select>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <label className="form-label">Average Ambient Humidity</label>
                                                <input type="text" name="humidity" value={data.humidity} onChange={handleInputChange} className="form-control" />
                                            </>
                                        )}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Date of Fumigation</label>
                                        <input type="date" name="f_date" value={data.f_date || data.fumigationStarted} onChange={handleInputChange} className="form-control" />
                                    </div>
                                </div>
                                <div className="row g-3 mt-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Fumigation Performed Under gastight sheets</label>
                                        <select name="f_performed" value={data.f_performed} onChange={handleInputChange} className="form-select">
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Container has 200mm free air space at top of container</label>
                                        <select name="f_airspace" value={data.f_airspace} onChange={handleInputChange} className="form-select">
                                            <option value="N/A">N/A</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Fumigation Carried Out In</label>
                                        <select name="fcoi" value={data.fcoi} onChange={handleInputChange} className="form-select">
                                            <option value="NSPM 12 AND ISPM 15 REGULATION OF IPPC">NSPM 12 AND ISPM 15 REGULATION OF IPPC</option>
                                            <option value="NSPM 12">NSPM 12</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                            <option value="Non-Phyto">Non-Phyto</option>
                                            <option value="Phyto">Phyto</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Container No. Place</label>
                                        <select name="cnoat" value={data.cnoat} onChange={handleInputChange} className="form-select">
                                            <option value="In Additional Declaration">In Additional Declaration</option>
                                            <option value="As Per Format">As Per Format</option>
                                            <option value="In Additional Declaration - Attachment">In Additional Declaration - Attachment</option>
                                            <option value="As Per Format - Attachment">As Per Format - Attachment</option>
                                            <option value="As Per Format - Hide Numbers">As Per Format - Hide Numbers</option>
                                            <option value="As per Bill of Lading">As per Bill of Lading</option>
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
                        <div className="d-flex justify-content-end mb-4">
                            <button type="button" className="btn btn-primary" onClick={handleGeneratePdf} disabled={isSaving}>
                                {isSaving ? 'Saving…' : 'Generate PDF'}
                            </button>
                        </div>
                        {saveStatus ? (
                            <div className="form-status">
                                <p>{saveStatus}</p>
                            </div>
                        ) : null}
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">Actions & Status</div>
                            <div className="card-body">
                                {saveStatus ? (
                                    <div className="alert alert-info">{saveStatus}</div>
                                ) : (
                                    <p className="text-muted">No recent actions.</p>
                                )}
                                <div className="d-grid">
                                    <button type="button" className="btn btn-success mb-2" onClick={handleGeneratePdf} disabled={isSaving}>{isSaving ? 'Saving…' : 'Generate & Save'}</button>
                                    <button type="button" className="btn btn-outline-primary mb-2" onClick={() => {
                                        try {
                                            sessionStorage.setItem('printData', JSON.stringify(data));
                                            window.open('/print', '_blank');
                                        } catch (err) {
                                            // fallback: show status
                                            setSaveStatus('Failed to open print view.');
                                        }
                                    }}>Open Print View</button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => (onViewSaved ? onViewSaved() : navigate('/list'))}>View saved certificates</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CertificateForm;
