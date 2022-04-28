import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
                userService.success();
                userService.setUser(response);
                if (from) {
                    navigate(from, { replace: true });
                }
                await request('/api/user/create', 'POST', response, {}, true);
            }
        },
        [navigate, request],
    );

    const logout = useCallback(async () => {
        userService.setUser(null);
        await request('/auth/logout', 'POST', null);
    }, [request]);

    const value = {
        login,
        logout,
    };

    return value;
};
