import { PDFDocument } from 'pdf-lib';
import { CertificateData } from '../types/certificate';
import { renderAlpPdf } from './alpRenderer';
import { renderMbPdf } from './mbRenderer';

export async function generateCertificatePdf(data: CertificateData) {
    const pdfDoc = await PDFDocument.create();

    switch (data.certificateType) {
        case 'ALP':
            await renderAlpPdf(pdfDoc, data);
            break;
        case 'MB':
            await renderMbPdf(pdfDoc, data);
            break;
        default:
            await renderMbPdf(pdfDoc, data);
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${data.certificateType}-certificate.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}
