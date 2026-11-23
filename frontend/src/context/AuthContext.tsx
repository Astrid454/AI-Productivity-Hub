import {createContext, useEffect, useState, type ReactNode} from "react";
import {authenticatedFetch, refreshTokenOnce, AuthenticationError} from "../services/apiClient";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    isInitializing: boolean;

    authenticatedRequest: (
        url: string,
        options?: RequestInit
    ) => Promise<Response>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        let active = true;

        async function restoreSession() {
            try {
                const newToken = await refreshTokenOnce();

                if(active) {
                    setToken(newToken);
                }
            } catch {
                if(active) {
                    setToken(null);
                }
            } finally {
                if(active) {
                    setIsInitializing(false);
                }
            }
        }

        void restoreSession();

        return () => {
            active = false;
        };
    }, []);

    async function authenticatedRequest(
        url: string,
        options: RequestInit = {}
    ): Promise<Response> {
        if (!token) {
            throw new AuthenticationError();
        }

        try {
            return await authenticatedFetch(
                url,
                options,
                token,
                setToken
            );
        } catch (error) {
            if (error instanceof AuthenticationError) {
                setToken(null);
            }

            throw error;
        }
    }

    return (
      <AuthContext.Provider
          value={{ token, setToken, isInitializing, authenticatedRequest}}
      >
          {children}
      </AuthContext.Provider>
    );
}