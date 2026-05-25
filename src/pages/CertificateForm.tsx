import { type ChangeEvent, type FormEvent, useState } from 'react';
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
};

interface CertificateFormProps {
    onLogout?: () => void;
    onViewSaved?: () => void;
}

function CertificateForm({ onLogout, onViewSaved }: CertificateFormProps) {
    const [data, setData] = useState(initialData);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const isMb = data.certificateType === 'MB';

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

    return (
        <div className="page-shell">
            <header className="page-header">
                <div>
                    <p className="eyebrow">Phase 1 MVP</p>
                    <h1>Fumigation Certificate Generator</h1>
                    <p>Enter the details below, then generate a fixed-layout PDF.</p>
                </div>
                <div>
                    {onViewSaved ? (
                        <button type="button" className="secondary-button" onClick={onViewSaved}>
                            View saved certificates
                        </button>
                    ) : null}
                    {onLogout ? (
                        <button type="button" className="secondary-button" onClick={onLogout}>
                            Logout
                        </button>
                    ) : null}
                </div>
            </header>
            <form className="certificate-form compact-form" onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
                <div className="compact-section">
                    <div className="compact-section-header">Certificate Details</div>
                    <div className="compact-row">
                        <label>
                            Certificate Type
                            <select name="certificateType" value={data.certificateType} onChange={handleInputChange}>
                                <option value="MB">MB</option>
                                <option value="ALP">ALP</option>
                            </select>
                        </label>
                        <label>
                            Certificate Number
                            <input type="text" name="certificateNumber" value={data.certificateNumber} onChange={handleInputChange} />
                        </label>
                        <label>
                            Date Issued
                            <input type="date" name="dateIssued" value={data.dateIssued} onChange={handleInputChange} />
                        </label>
                    </div>
                </div>
                <div className="compact-section">
                    <div className="compact-section-header">Client / Shipment Details</div>
                    <div className="compact-row">
                        <label>
                            Exporter Name
                            <input type="text" name="exporterName" value={data.exporterName} onChange={handleInputChange} />
                        </label>
                        <label>
                            Consignee Name
                            <input type="text" name="consigneeName" value={data.consigneeName} onChange={handleInputChange} />
                        </label>
                        <label>
                            Type and Description of Cargo
                            <input type="text" name="commodityDescription" value={data.commodityDescription} onChange={handleInputChange} />
                        </label>
                    </div>
                    <div className="compact-row">
                        <label>
                            Commodity Quantity
                            <input type="text" name="commodityQuantity" value={data.commodityQuantity} onChange={handleInputChange} />
                        </label>
                        <label>
                            Net Weight
                            <input type="text" name="netWeight" value={data.netWeight} onChange={handleInputChange} />
                        </label>
                        <label>
                            Packaging Material
                            <input type="text" name="packagingMaterial" value={data.packagingMaterial} onChange={handleInputChange} />
                        </label>
                        <label>
                            Shipping Mark / Brand
                            <input type="text" name="shippingMark" value={data.shippingMark} onChange={handleInputChange} />
                        </label>
                    </div>
                </div>
                <div className="compact-section">
                    <div className="compact-section-header">Treatment Details</div>
                    <div className="compact-row">
                        <label>
                            Name of Fumigant
                            <input type="text" name="fumigantName" value={data.fumigantName} onChange={handleInputChange} />
                        </label>
                        <label>
                            Place of Fumigation
                            <input type="text" name="placeOfFumigation" value={data.placeOfFumigation} onChange={handleInputChange} />
                        </label>
                        <label>
                            Dose Rate
                            <input type="text" name="doseRate" value={data.doseRate} onChange={handleInputChange} />
                        </label>
                        <label>
                            Duration of Fumigation
                            <input type="text" name="durationFumigation" value={data.durationFumigation} onChange={handleInputChange} />
                        </label>
                        {isMb ? (
                            <label>
                                Average Ambient Temperature
                                <input type="text" name="temperature" value={data.temperature} onChange={handleInputChange} />
                            </label>
                        ) : (
                            <label>
                                Average Ambient Humidity
                                <input type="text" name="humidity" value={data.humidity} onChange={handleInputChange} />
                            </label>
                        )}
                        <label>
                            Date of Fumigation
                            <input type="date" name="fumigationStarted" value={data.fumigationStarted} onChange={handleInputChange} />
                        </label>
                    </div>
                </div>
                <div className="compact-section">
                    <div className="compact-section-header">Operator Details</div>
                    <div className="compact-row">
                        <label>
                            Fumigator Name / Accreditation Number
                            <input type="text" name="fumigatorName" value={data.fumigatorName} onChange={handleInputChange} />
                        </label>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" className="primary-button" onClick={handleGeneratePdf} disabled={isSaving}>
                        {isSaving ? 'Saving…' : 'Generate PDF'}
                    </button>
                </div>
                {saveStatus ? (
                    <div className="form-status">
                        <p>{saveStatus}</p>
                    </div>
                ) : null}
            </form>
        </div>
    );
}

export default CertificateForm;
