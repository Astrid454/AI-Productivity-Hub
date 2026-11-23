import {refreshAccessToken} from "./authService";

let refreshPromise: Promise<string> | null = null;

export class AuthenticationError extends Error {
    constructor() {
        super("Your session has expired. Please log in again.");
        this.name = "AuthenticationError";
    }
}

export function checkAuthentication(response: Response): void {
    if(response.status === 401) {
        throw new AuthenticationError();
    }
}

export function refreshTokenOnce(): Promise<string> {
    if (refreshPromise === null) {
        refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

export type AuthenticatedRequest = (
    url: string,
    options?: RequestInit
) => Promise<Response>;


export async function authenticatedFetch(
    url: string,
    options: RequestInit,
    token: string,
    onTokenRefreshed: (newToken: string) => void
): Promise<Response> {

    function sendRequest(accessToken: string): Promise<Response> {
        const headers = new Headers(options.headers);

        headers.set("Authorization", `Bearer ${accessToken}`);

        return fetch(url, {
            ...options,
            headers
        });
    }

    let response = await sendRequest(token);

    if (response.status !== 401) {
        return response;
    }

    let newToken: string;

    try {
        newToken = await refreshTokenOnce();
    } catch {
        throw new AuthenticationError();
    }

    onTokenRefreshed(newToken);

    response = await sendRequest(newToken);

    if (response.status === 401) {
        throw new AuthenticationError();
    }

    return response;
}