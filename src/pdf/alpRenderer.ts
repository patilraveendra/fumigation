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

function isAdditionalFlag(val?: string) {
    const s = val?.toLowerCase() ?? '';
    return s.includes('additional') || s.includes('addtional') || s.includes('addit');
}

function quantityText(data: CertificateData) {
    return [data.commodityQuantity, data.netWeight].map(cleanValue).filter(Boolean).join(' / ');
}

function containerText(data: CertificateData) {
    return (data.containers ?? [])
        .map((container) => {
            const contValue = cleanValue(container.cont);
            const sealValue = cleanValue(container.seal);
            if (!contValue && !sealValue) return '';
            return `${contValue}${sealValue ? ` / ${sealValue}` : ''}`;
        })
        .filter(Boolean)
        .join('; ');
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

export async function renderAlpPdf(pdfDoc: PDFDocument, data: CertificateData) {
    const page = await createTemplatePage(pdfDoc, 'ALP');
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const containerTextValue = data.cnoat?.toLowerCase().includes('format') ? containerText(data) : '';
    const declarationSource = cleanValue(data.declarationText || data.declaration);
    const declarationTextValue = isAdditionalFlag(data.cnoat) && containerText(data)
        ? [declarationSource, containerText(data)].filter(Boolean).join(' ')
        : declarationSource;
    const humiditySource = cleanValue(data.humidity);
    const tempSource = cleanValue(data.temperature || data.f_temperature);
    const humidityTextValue = humiditySource
        ? `${humiditySource}%${tempSource ? ` (TEMP ${tempSource}°C)` : ''}`
        : (tempSource ? `TEMP ${tempSource}°C` : '');

    drawFields(page, font, [
        { text: data.certificateNumber, x: 420, top: 115, width: 118, height: 18 },
        { text: data.dateIssued, x: 420, top: 137, width: 118, height: 14 },
        { text: data.fumigantName, x: 256, top: 219, width: 282, height: 13, offsetY: -4 },
        { text: data.fumigationStarted, x: 256, top: 233, width: 282, height: 13, offsetY: -4 },
        { text: data.placeOfFumigation, x: 256, top: 247, width: 282, height: 13, offsetY: -4 },
        { text: data.doseRate, x: 256, top: 261, width: 282, height: 13, offsetY: -4 },
        { text: data.durationFumigation, x: 256, top: 275, width: 282, height: 13, offsetY: -4 },
        { text: humidityTextValue, x: 256, top: 289, width: 282, height: 22, offsetY: -4 },
        { text: data.exporterName, x: 256, top: 342, width: 282, height: 44 },
        { text: data.consigneeName, x: 256, top: 387, width: 282, height: 31 },
        { text: data.notify, x: 256, top: 420, width: 282, height: 12, size: 8, minSize: 6 },
        { text: containerTextValue, x: 256, top: 419, width: 282, height: 18, size: 9, minSize: 6, offsetY: -4 },
        { text: data.commodityDescription, x: 256, top: 439, width: 282, height: 19, offsetY: -5 },
        { text: quantityText(data), x: 256, top: 460, width: 282, height: 35, offsetY: -6 },
        { text: data.packagingMaterial, x: 256, top: 496, width: 282, height: 18, offsetY: -4 },
        { text: data.shippingMark, x: 256, top: 515, width: 282, height: 15, offsetY: -4 },
        { text: declarationTextValue, x: 256, top: 531, width: 282, height: 35, offsetY: -4 },
        { text: data.fumigatorName || data.accreditationNumber, x: 96, top: 574, width: 286, height: 8, size: 4.4, minSize: 4 },
        { text: data.dateIssued || data.fumigationCompleted, x: 393, top: 574, width: 82, height: 8, size: 4.4, minSize: 4 },
    ]);
}
