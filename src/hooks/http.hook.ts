/* eslint-disable no-param-reassign */
import { useState, useCallback, useContext } from 'react';
import { AuthContext } from 'src/context/Authcontext';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { logout } = useContext(AuthContext);
    const baseUrl = 'https://ya-praktikum.tech/api/v2';
    const request = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setLoading(true);
            try {
                if (body) {
                    body = JSON.stringify(body);
                    headers['Content-Type'] = 'application/json';
                }
                const response = await fetch(baseUrl + url, {
                    method,
                    body,
                    headers,
                    credentials: 'include',
                });

                if (response.status === 401) {
                    logout();
                }

                const contentType = response.headers
                    .get('content-type')
                    ?.split(';')[0];
                let data;
                if (contentType === 'application/json') {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
                if (!response.ok) {
                    throw new Error(data.reason || 'Что-то пошло не так');
                }
                setLoading(false);
                return data;
            } catch (e) {
                setLoading(false);
                setError((e as Error).message);
                throw e;
            }
        },
        [logout],
    );
    const clearError = useCallback(() => setError(''), []);

    return {
        loading,
        request,
        error,
        clearError,
    };
};
