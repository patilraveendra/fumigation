import { CertificateData } from '../types/certificate';

const apiBaseUrl = ((import.meta as unknown) as { env: { VITE_API_BASE_URL?: string } }).env.VITE_API_BASE_URL ?? 'http://localhost:5000';

export type CertificateRecord = {
    id: string;
    createdAtUtc: string;
    data: Partial<CertificateData>;
};

export async function saveCertificate(data: CertificateData) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/certificates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API error (${response.status}): ${text || response.statusText}`);
        }

        return response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to reach API at ${apiBaseUrl}: ${error.message}`);
        }
        throw error;
    }
}

export async function fetchCertificates() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/certificates`);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API error (${response.status}): ${text || response.statusText}`);
        }

        return (await response.json()) as CertificateRecord[];
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to reach API at ${apiBaseUrl}: ${error.message}`);
        }
        throw error;
    }
}

export async function pingApi() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/certificates`);
        const text = await response.text();
        return { ok: response.ok, status: response.status, body: text };
    } catch (error) {
        if (error instanceof Error) {
            return { ok: false, status: 0, body: error.message };
        }
        return { ok: false, status: 0, body: 'Unknown error' };
    }
}
