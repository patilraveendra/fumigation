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
    // Additional MB/ALP fields from legacy form (optional)
    tc_country?: string;
    noOfQuantity?: string;
    detail?: string;
    ct20?: string;
    ct40?: string;
    containers?: Array<{ cont?: string; seal?: string }>;
    quantityDeclared?: string;
    marks?: string;
    l_ship?: string; // shipping marks
    d_name?: string; // exporter display name
    d_address?: string; // exporter address
    c_name?: string; // consignee name
    c_address?: string; // consignee address
    notify?: string;
    f_type?: string;
    f_date?: string;
    f_place?: string;
    f_doserate?: string;
    f_dosetype?: string;
    f_duration?: string;
    f_duration_days?: string;
    f_duration_hours?: string;
    f_hour?: string;
    f_temperature?: string;
    f_ttype?: string;
    f_performed?: string;
    f_airspace?: string;
    fcoi?: string;
    phnph?: string;
    cnoat?: string;
    declaration?: string;
    oremark?: string;
    invoiceno?: string;
}
