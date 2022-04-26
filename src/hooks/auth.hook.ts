import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from 'src/store/services/userService';
import { useHttp } from './http.hook';

export const useAuth = () => {
    const { request } = useHttp();
    const login = useCallback(async () => {
        userService.pending();
        const response = await request('/auth/user', 'GET', null);
        if (response) {
            userService.success();
            userService.setUser(response);
            await request('/api/user/create', 'POST', response, {}, true);
        }
    }, [request]);

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
