import { useState, useCallback } from 'react';
import { useHttp } from './http.hook';

export const useAuth = () => {
    const { request } = useHttp();
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState({
        id: '',
        first_name: '',
        second_name: '',
        display_name: '',
        login: '',
        email: '',
        phone: '',
        avatar: '',
    });

    const login = useCallback(async () => {
        const fetched = await request('/auth/user', 'GET', null);
        if (fetched) {
            setIsAuth(true);
            setUser(fetched);
            await request('/api/user/create', 'POST', fetched, {}, true);
        }
    }, [request]);

    const logout = useCallback(async () => {
        setIsAuth(false);
        await request('/auth/logout', 'POST', null);
    }, [request]);

    return {
        login,
        logout,
        isAuth,
        user,
        setUser,
    };
};
