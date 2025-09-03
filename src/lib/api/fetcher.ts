// src/lib/api/fetcher.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public url: string,
        public body?: string
    ) {
        super(`API Error ${status}: ${statusText}`);
        this.name = "ApiError";
    }
}

type ApiFetchOptions = RequestInit & {
    skipAuth?: boolean;
    next?: { revalidate?: number; tags?: string[] };
    timeoutMs?: number;
};

export async function apiFetch<T>(
    endpoint: string,
    options: ApiFetchOptions = {},
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.skipAuth ? {} : { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY! }),
        ...options.headers,
    };

    const controller = new AbortController();
    const timeout = options.timeoutMs
        ? setTimeout(() => controller.abort(), options.timeoutMs)
        : undefined;

    try {
        const res = await fetch(url, {
            ...options,
            headers,
            next: options.next,
            signal: controller.signal,
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new ApiError(res.status, res.statusText, url, text);
        }

        return res.json();
    } finally {
        if (timeout) clearTimeout(timeout);
    }
}

export function apiPost<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiFetchOptions, "method" | "body">
): Promise<T> {
    return apiFetch<T>(endpoint, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
        ...options,
    });
}
