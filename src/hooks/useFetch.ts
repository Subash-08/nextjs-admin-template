import { useState, useCallback } from "react";

interface FetchOptions extends RequestInit {
    body?: any;
}

export function useFetch<T = any>() {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = useCallback(async (url: string, options?: FetchOptions) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...options?.headers,
                },
                body: options?.body ? JSON.stringify(options.body) : undefined,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            setData(result);
            return result;
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, error, loading, fetchData };
}
