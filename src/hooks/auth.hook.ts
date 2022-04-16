import { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from './http.hook';

const storageName = 'bShip';

export const useAuth = () => {
    const { request } = useHttp();
    const history = useHistory();
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
        history.push(PageLinks.home);
        await request('/api/user/create', 'POST', fetched, {}, true);
    }, [request, history]);

    const logout = useCallback(async () => {
        setIsAuth(false);
        localStorage.removeItem(storageName);
        await request('/auth/logout', 'POST', null);
        history.push(PageLinks.home);
    }, [request, history]);

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
