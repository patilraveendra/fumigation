import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { CertificateData } from '../types/certificate';
import { createTemplatePage } from './templateLoader';

type Field = {
    text: string;
    x: number;
    top: number;
    width: number;
    height: number;
    size?: number;
    minSize?: number;
    offsetY?: number;
};

const textColor = rgb(0, 0, 0);

function cleanValue(value: string | undefined) {
    return value?.trim() || '';
}

function quantityText(data: CertificateData) {
    return [data.commodityQuantity, data.netWeight].map(cleanValue).filter(Boolean).join(' / ');
}

function topToY(page: PDFPage, top: number, size: number) {
    return page.getHeight() - top - size;
}

function splitLongWord(word: string, font: PDFFont, size: number, width: number) {
    const parts: string[] = [];
    let current = '';

    for (const char of word) {
        const test = `${current}${char}`;
        if (font.widthOfTextAtSize(test, size) <= width || !current) {
            current = test;
        } else {
            parts.push(current);
            current = char;
        }
    }

    if (current) {
        parts.push(current);
    }

    return parts;
}

function wrapText(text: string, font: PDFFont, size: number, width: number) {
    const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    const lines: string[] = [];
    let currentLine = '';

    for (const rawWord of words) {
        const wordParts = font.widthOfTextAtSize(rawWord, size) > width
            ? splitLongWord(rawWord, font, size, width)
            : [rawWord];

        for (const word of wordParts) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;

            if (font.widthOfTextAtSize(testLine, size) <= width) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

function fitLines(text: string, font: PDFFont, field: Field) {
    const minSize = field.minSize ?? 4.8;
    let size = field.size ?? 6.2;

    while (size > minSize) {
        const lineHeight = size + 1.2;
        const maxLines = Math.max(1, Math.floor((field.height - 3) / lineHeight));
        const lines = wrapText(text, font, size, field.width);

        if (lines.length <= maxLines) {
            return { size, lineHeight, lines };
        }

        size -= 0.3;
    }

    const lineHeight = minSize + 1;
    const maxLines = Math.max(1, Math.floor((field.height - 3) / lineHeight));
    return {
        size: minSize,
        lineHeight,
        lines: wrapText(text, font, minSize, field.width).slice(0, maxLines),
    };
}

function drawField(page: PDFPage, font: PDFFont, field: Field) {
    const text = cleanValue(field.text);

    if (!text) {
        return;
    }

    const { size, lineHeight, lines } = fitLines(text, font, field);
    const textBlockHeight = size + (lines.length - 1) * lineHeight;
    const topPadding = lines.length === 1
        ? Math.max(1, (field.height - size) / 2 - 1)
        : Math.max(1, (field.height - textBlockHeight) / 2);
    const startTop = field.top + topPadding + (field.offsetY ?? 0);

    lines.forEach((line, index) => {
        page.drawText(line, {
            x: field.x,
            y: topToY(page, startTop + index * lineHeight, size),
            size,
            font,
            color: textColor,
        });
    });
}

function drawFields(page: PDFPage, font: PDFFont, fields: Field[]) {
    fields.forEach((field) => drawField(page, font, field));
}

export async function renderMbPdf(pdfDoc: PDFDocument, data: CertificateData) {
    const page = await createTemplatePage(pdfDoc, 'MB');
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    drawFields(page, font, [
        { text: data.certificateNumber, x: 416, top: 124, width: 125, height: 16 },
        { text: data.dateIssued, x: 416, top: 148, width: 125, height: 16 },
        { text: data.fumigantName, x: 219, top: 220, width: 115, height: 13, offsetY: -4 },
        { text: data.fumigationStarted, x: 443, top: 220, width: 98, height: 13, offsetY: -4 },
        { text: data.placeOfFumigation, x: 219, top: 234, width: 115, height: 13, offsetY: -4 },
        { text: data.doseRate, x: 443, top: 234, width: 98, height: 13, offsetY: -4 },
        { text: data.durationFumigation, x: 219, top: 248, width: 322, height: 13, offsetY: -4 },
        { text: data.temperature, x: 443, top: 262, width: 98, height: 13, offsetY: -4 },
        { text: data.exporterName, x: 269, top: 322, width: 270, height: 42 },
        { text: data.consigneeName, x: 269, top: 365, width: 270, height: 42 },
        { text: data.commodityDescription, x: 269, top: 407, width: 270, height: 29, offsetY: -8 },
        { text: quantityText(data), x: 269, top: 437, width: 270, height: 18, offsetY: -4 },
        { text: data.packagingMaterial, x: 269, top: 456, width: 270, height: 20, offsetY: -4 },
        { text: data.shippingMark, x: 269, top: 477, width: 270, height: 15, offsetY: -4 },
        { text: data.declarationText, x: 269, top: 493, width: 270, height: 35, offsetY: -4 },
        { text: data.fumigatorName || data.accreditationNumber, x: 96, top: 544, width: 314, height: 8, size: 4.4, minSize: 4 },
        { text: data.dateIssued || data.fumigationCompleted, x: 454, top: 544, width: 82, height: 8, size: 4.4, minSize: 4 },
    ]);
}
