import { useState, useCallback, useContext } from 'react';
import { AuthContext } from 'src/context/Authcontext';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { logout } = useContext(AuthContext);
    const baseUrl = 'https://ya-praktikum.tech/api/v2';
    const request = useCallback(
        async (url, method, body, headers = {}, DB = false, image = null) => {
            setLoading(true);
            try {
                let currentBody = null;
                const currentHeaders = { ...headers };
                if (body) {
                    currentBody = JSON.stringify(body);
                    currentHeaders['Content-Type'] = 'application/json';
                }
                if (image) {
                    currentBody = image;
                }
                const response = await fetch((DB ? '' : baseUrl) + url, {
                    method: method || 'GET',
                    body: currentBody,
                    headers: currentHeaders,
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
