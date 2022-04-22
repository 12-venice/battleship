import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttp } from './http.hook';

export const useAuth = () => {
    const { request } = useHttp();
    const navigate = useNavigate();
    const [user, setUser] = useState(undefined);

    const login = useCallback(
        async (from?) => {
            const fetched = await request('/auth/user', 'GET', null);
            if (fetched) {
                setUser(fetched);
                if (from) {
                    navigate(from, { replace: true });
                }
                await request('/api/user/create', 'POST', fetched, {}, true);
            }
        },
        [navigate, request],
    );

    const logout = useCallback(async () => {
        setUser(undefined);
        await request('/auth/logout', 'POST', null);
    }, [request]);

    useEffect(() => {
        login();
    }, [login]);

    const value = {
        login,
        logout,
        user,
        setUser,
    };

    return value;
};
