import { type ChangeEvent, type FormEvent, useState } from 'react';
import { CertificateData } from '../types/certificate';
import { generateCertificatePdf } from '../pdf/pdfService';

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

function CertificateForm() {
    const [data, setData] = useState(initialData);
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
        await generateCertificatePdf(data);
    };

    return (
        <div className="page-shell">
            <header className="page-header">
                <div>
                    <p className="eyebrow">Phase 1 MVP</p>
                    <h1>Fumigation Certificate Generator</h1>
                    <p>Enter the details below, then generate a fixed-layout PDF.</p>
                </div>
            </header>

            <form className="certificate-form" onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
                <section className="form-section">
                    <h2>Certificate Details</h2>
                    <div className="field-grid field-grid-two">
                        <label className="field-item">
                            <span>Certificate Type</span>
                            <select name="certificateType" value={data.certificateType} onChange={handleInputChange}>
                                <option value="MB">MB</option>
                                <option value="ALP">ALP</option>
                            </select>
                        </label>
                        <label className="field-item">
                            <span>Certificate Number</span>
                            <input type="text" name="certificateNumber" value={data.certificateNumber} onChange={handleInputChange} />
                        </label>
                        <label className="field-item">
                            <span>Date Issued</span>
                            <input type="date" name="dateIssued" value={data.dateIssued} onChange={handleInputChange} />
                        </label>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Client / Shipment Details</h2>
                    <div className="field-grid field-grid-two">
                        <label className="field-item">
                            <span>Exporter Name</span>
                            <input type="text" name="exporterName" value={data.exporterName} onChange={handleInputChange} />
                        </label>
                        <label className="field-item">
                            <span>Consignee Name</span>
                            <input type="text" name="consigneeName" value={data.consigneeName} onChange={handleInputChange} />
                        </label>
                        <label className="field-item full-width">
                            <span>Type and Description of Cargo</span>
                            <input type="text" name="commodityDescription" value={data.commodityDescription} onChange={handleInputChange} />
                        </label>
                        <label className="field-item">
                            <span>Commodity Quantity</span>
                            <input type="text" name="commodityQuantity" value={data.commodityQuantity} onChange={handleInputChange} />
                        </label>
                        <label className="field-item">
                            <span>Net Weight</span>
                            <input type="text" name="netWeight" value={data.netWeight} onChange={handleInputChange} />
                        </label>
                        <label className="field-item">
                            <span>Packaging Material</span>
                            <input type="text" name="packagingMaterial" value={data.packagingMaterial} onChange={handleInputChange} />
                        </label>
                        <label className="field-item full-width">
                            <span>Shipping Mark / Brand</span>
                            <input type="text" name="shippingMark" value={data.shippingMark} onChange={handleInputChange} />
                        </label>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Treatment Details</h2>
                    <div className="field-grid field-grid-two">
                        <label className="field-item">
                            <span>Name of Fumigant</span>
                            <input type="text" name="fumigantName" value={data.fumigantName} onChange={handleInputChange} />
                        </label>
                        <label className="field-item">
                            <span>Place of Fumigation</span>
                            <input type="text" name="placeOfFumigation" value={data.placeOfFumigation} onChange={handleInputChange} />
                        </label>
                        <label className="field-item">
                            <span>Dose Rate</span>
                            <input type="text" name="doseRate" value={data.doseRate} onChange={handleInputChange} />
                        </label>
                        <label className="field-item">
                            <span>Duration of Fumigation</span>
                            <input type="text" name="durationFumigation" value={data.durationFumigation} onChange={handleInputChange} />
                        </label>
                        {isMb ? (
                            <label className="field-item">
                                <span>Average Ambient Temperature</span>
                                <input type="text" name="temperature" value={data.temperature} onChange={handleInputChange} />
                            </label>
                        ) : (
                            <label className="field-item">
                                <span>Average Ambient Humidity</span>
                                <input type="text" name="humidity" value={data.humidity} onChange={handleInputChange} />
                            </label>
                        )}
                        <label className="field-item">
                            <span>Date of Fumigation</span>
                            <input type="date" name="fumigationStarted" value={data.fumigationStarted} onChange={handleInputChange} />
                        </label>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Additional Declaration</h2>
                    <div className="field-grid field-grid-two">
                        <label className="field-item full-width">
                            <span>Declaration Text</span>
                            <textarea name="declarationText" value={data.declarationText} onChange={handleInputChange} rows={3} />
                        </label>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Operator Details</h2>
                    <div className="field-grid field-grid-two">
                        <label className="field-item">
                            <span>Fumigator Name / Accreditation Number</span>
                            <input type="text" name="fumigatorName" value={data.fumigatorName} onChange={handleInputChange} />
                        </label>
                    </div>
                </section>

                <div className="form-actions">
                    <button type="button" className="primary-button" onClick={handleGeneratePdf}>
                        Generate PDF
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CertificateForm;
