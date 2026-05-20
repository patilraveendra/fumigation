export type CertificateType = 'ALP' | 'MB';

export type GasTightSheetsOption = 'Yes' | 'No';

export interface CertificateData {
    certificateType: CertificateType;
    certificateNumber: string;
    dateIssued: string;
    providerId: string;
    accreditationNumber: string;
    clientName: string;
    clientAddress: string;
    exporterName: string;
    consigneeName: string;
    destinationCountry: string;
    portOfLoading: string;
    sealNumber: string;
    commodityDescription: string;
    commodityQuantity: string;
    netWeight: string;
    packagingMaterial: string;
    countryOfOrigin: string;
    shippingMark: string;
    fumigantName: string;
    placeOfFumigation: string;
    doseRate: string;
    appliedDose: string;
    exposurePeriod: string;
    durationFumigation: string;
    temperature: string;
    humidity: string;
    finalTlvReading: string;
    fumigationStarted: string;
    fumigationCompleted: string;
    gasTightSheets: GasTightSheetsOption;
    declarationText: string;
    invoiceNumber: string;
    invoiceDate: string;
    fumigatorName: string;
}
