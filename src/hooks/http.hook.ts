/* eslint-disable no-param-reassign */
import { useState, useCallback } from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const domen = 'https://ya-praktikum.tech/api/v2/';
    const request = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setLoading(true);
            try {
                if (body) {
                    body = JSON.stringify(body);
                    headers['Content-Type'] = 'application/json';
                }
                const response = await fetch(domen + url, {
                    method,
                    body,
                    headers,
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Что-то пошло не так');
                }
                setLoading(false);

                return data;
            } catch (e) {
                setLoading(false);
                setError((e as Error).message);
                throw e;
            }
        },
        [],
    );
    const clearError = useCallback(() => setError(''), []);

    return {
        loading,
        request,
        error,
        clearError,
    };
};
