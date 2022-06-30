/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { useState, useCallback, useEffect } from 'react';
import { useMessage } from './message.hook';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const message = useMessage();

    const request = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setLoading(true);
            try {
                if (body && headers['Content-Disposition'] !== 'form-data') {
                    body = JSON.stringify(body);
                    headers['Content-Type'] = 'application/json';
                }
                const response = await fetch(url, { method, body, headers });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Что-то пошло не так');
                }
                setLoading(false);

                return data;
            } catch (err: any) {
                setLoading(false);
                setError(err.message);
                throw err;
            }
        },
        [],
    );
    const clearError = useCallback(() => setError(null), []);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);
    return { loading, request, error, clearError };
};
