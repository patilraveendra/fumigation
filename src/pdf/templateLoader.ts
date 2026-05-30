import { PDFDocument } from 'pdf-lib';
import { CertificateType } from '../types/certificate';

const templateUrls: Record<CertificateType, string> = {
    MB: '/MB_CERT_STACK.pdf',
    ALP: '/ALP_CERT_STACK.pdf',
};

export async function createTemplatePage(pdfDoc: PDFDocument, certificateType: CertificateType) {
    const url = templateUrls[certificateType];
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load PDF template for ${certificateType}: ${response.status} ${response.statusText}`);
    }
    const templateBytes = await response.arrayBuffer();
    const templateDoc = await PDFDocument.load(templateBytes);
    const templatePage = templateDoc.getPage(0);
    const embeddedTemplatePage = await pdfDoc.embedPage(templatePage);
    const page = pdfDoc.addPage([embeddedTemplatePage.width, embeddedTemplatePage.height]);
    page.drawPage(embeddedTemplatePage, {
        x: 0,
        y: 0,
        width: embeddedTemplatePage.width,
        height: embeddedTemplatePage.height,
    });

    return page;
}
