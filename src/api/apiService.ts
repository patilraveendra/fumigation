import { CertificateData } from '../types/certificate';

const apiBaseUrl = ((import.meta as unknown) as { env: { VITE_API_BASE_URL?: string } }).env.VITE_API_BASE_URL ?? 'http://localhost:5000';

export type CertificateRecord = {
    id: string;
    createdAtUtc: string;
    data: Partial<CertificateData>;
};

export async function saveCertificate(data: CertificateData) {
    const endpoint = data.certificateType === 'MB'
        ? `${apiBaseUrl}/api/mb/certificates`
        : `${apiBaseUrl}/api/alp/certificates`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add a client-side origin header for debugging (cannot replace browser-sent Origin)
                'X-Client-Origin': typeof window !== 'undefined' ? window.location.origin : '',
            },
            mode: 'cors',
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

// Call server debug endpoint to echo headers/originAllowed (useful for remote debugging)
export async function debugServer() {
    try {
        const response = await fetch(`${apiBaseUrl}/debug`, { method: 'GET', mode: 'cors' });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Debug API error (${response.status}): ${text || response.statusText}`);
        }
        return response.json();
    } catch (error) {
        if (error instanceof Error) throw new Error(`Failed to reach debug endpoint at ${apiBaseUrl}: ${error.message}`);
        throw error;
    }
}

export async function fetchCertificates() {
    try {
        // Fetch MB and ALP certificates in parallel from SQL-backed endpoints
        const [mbRes, alpRes] = await Promise.all([
            fetch(`${apiBaseUrl}/api/mb/certificates`),
            fetch(`${apiBaseUrl}/api/alp/certificates`),
        ]);

        if (!mbRes.ok) {
            const text = await mbRes.text();
            throw new Error(`API error (${mbRes.status}): ${text || mbRes.statusText}`);
        }
        if (!alpRes.ok) {
            const text = await alpRes.text();
            throw new Error(`API error (${alpRes.status}): ${text || alpRes.statusText}`);
        }

        const mbList = (await mbRes.json()) as any[];
        const alpList = (await alpRes.json()) as any[];

        const mapRecord = (item: any, type: 'MB' | 'ALP') => ({
            id: `${type}-${item.certificateId ?? item.certificateID ?? item.id ?? Math.random()}`,
            createdAtUtc: (item.createdDate ?? item.createdAtUtc ?? new Date()).toString(),
            data: { ...item } as Partial<CertificateData>,
        } as CertificateRecord);

        const combined = [
            ...mbList.map((i) => mapRecord(i, 'MB')),
            ...alpList.map((i) => mapRecord(i, 'ALP')),
        ];

        // sort by createdAtUtc desc
        combined.sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime());

        return combined;
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
