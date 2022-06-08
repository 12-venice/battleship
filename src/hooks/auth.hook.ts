import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from 'src/components/utils/Socket/Socket';
import { userService } from 'src/store/services/userService';
import { useHttp } from './http.hook';

const getYandexData = async (token: string[]) => {
    const response = await fetch(
        `https://login.yandex.ru/info?format=json&oauth_token=${token[1]}`,
    );
    const data = await response.json();
    return data;
};

export const useAuth = () => {
    const { request } = useHttp();
    const location = useLocation();
    const navigate = useNavigate();
    const login = useCallback(
        async (from?) => {
            userService.pending();
            const token = /access_token=([^&]+)/.exec(location.hash);
            let userData;
            if (token) {
                userData = await getYandexData(token);
            } else {
                userData = await request('/auth/user', 'GET', null);
            }
            if (userData.id) {
                const responseServer = await request(
                    '/api/user/create',
                    'POST',
                    userData,
                    {},
                    true,
                );
                userService.success();
                userService.setUser(responseServer);
                socket.emit('userOnline:add', responseServer._id);
                if (from) {
                    navigate(from, { replace: true });
                }
            }
        },
        [navigate, request],
    );

    const logout = useCallback(async () => {
        sessionStorage.setItem('yandexAutoLoginDisabled', 'true');
        userService.setUser(null);
        socket.emit('userOnline:remove');
        await request('/auth/logout', 'POST', null);
    }, [request]);

    const value = {
        login,
        logout,
    };

    return value;
};
