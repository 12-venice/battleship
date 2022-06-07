import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from 'src/components/utils/Socket/Socket';
import { userService } from 'src/store/services/userService';
import { useHttp } from './http.hook';

export const useAuth = () => {
    const { request } = useHttp();
    const navigate = useNavigate();
    const login = useCallback(
        async (from?) => {
            userService.pending();
            const response = await request('/auth/user', 'GET', null);
            if (response) {
                const responseServer = await request(
                    '/api/user/create',
                    'POST',
                    response,
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
