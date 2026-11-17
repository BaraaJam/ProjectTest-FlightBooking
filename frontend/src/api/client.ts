import type { ProblemDetail } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function request<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        let message = `Request failed (${response.status})`;

        try {
            const problem = (await response.json()) as ProblemDetail; // 2. read the body
            if (problem.detail) {
                message = problem.detail;
            }
        } catch {
            // body is not JSON → keep the fallback
        }
        throw new Error(message);
    }

    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
}