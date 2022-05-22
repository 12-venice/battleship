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
                socket.emit('auth', response.id);
                if (from) {
                    navigate(from, { replace: true });
                }
                const responseServer = await request(
                    '/api/user/create',
                    'POST',
                    response,
                    {},
                    true,
                );
                userService.success();
                userService.setUser(responseServer);
            }
        },
        [navigate, request],
    );

    const logout = useCallback(async () => {
        userService.setUser(null);
        socket.emit('!auth');
        await request('/auth/logout', 'POST', null);
    }, [request]);

    const value = {
        login,
        logout,
    };

    return value;
};
