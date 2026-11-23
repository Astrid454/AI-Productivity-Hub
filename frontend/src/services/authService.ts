import type {LoginResponse, UserResponse} from "../types/auth.ts";
import type {AuthenticatedRequest} from "./apiClient";

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {

    const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    if (!response.ok) {
        throw new Error("Invalid email or password");
    }

    return response.json();
}


export async function getCurrentUser(
    authenticatedRequest: AuthenticatedRequest
): Promise<UserResponse> {
    const response = await authenticatedRequest(
        "http://127.0.0.1:8000/auth/me",
        {
            method: "GET",
        }
    );

    if(!response.ok) {
        throw new Error("Failed to fetch current user");
    }

    return response.json();
}

export async function register(
    email: string,
    password: string
): Promise<void> {

    const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        }
    );

    if (!response.ok) {
        if (response.status === 409) {
            throw new Error("An account with this email already exists.");
        }

        throw new Error("Registration failed. Please try again.");
    }
}


export async function logout(): Promise<void> {
    const response = await fetch(
        "http://127.0.0.1:8000/auth/logout",
        {
            method: "POST",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to log out.");
    }
}


export async function refreshAccessToken(): Promise<string> {
    const response = await fetch(
        "http://127.0.0.1:8000/auth/refresh",
        {
            method: "POST",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to refresh session.");
    }

    const data: LoginResponse = await response.json();

    return data.access_token;
}