import type {LoginResponse} from "../types/auth.ts";

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