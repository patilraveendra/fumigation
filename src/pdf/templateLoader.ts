import { PDFDocument } from 'pdf-lib';
import { CertificateType } from '../types/certificate';

const templateUrls: Record<CertificateType, string> = {
    MB: new URL('../samples/MB_CERT_STACK.pdf', import.meta.url).href,
    ALP: new URL('../samples/ALP_CERT_STACK.pdf', import.meta.url).href,
};

export async function createTemplatePage(pdfDoc: PDFDocument, certificateType: CertificateType) {
    const response = await fetch(templateUrls[certificateType]);
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
