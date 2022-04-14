import { useState, useCallback, useEffect } from 'react';
import { useHttp } from './http.hook';

const storageName = 'bShip';

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
        setIsAuth(true);
        const fetched = await request('/auth/user', 'GET', null);
        setUser(fetched);
        localStorage.setItem(
            storageName,
            JSON.stringify({
                isAuth: true,
            }),
        );
    }, [request]);

    const logout = useCallback(async () => {
        await request('/auth/logout', 'POST', null);
        setIsAuth(false);
        localStorage.removeItem(storageName);
    }, [request]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName) || '{}');

        if (data && data.isAuth) {
            login();
        }
    }, [login]);

    return {
        login,
        logout,
        isAuth,
        user,
        setUser,
    };
};
