import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AllStateTypes } from 'src/store/reducers';
import { userService } from 'src/store/services/userService';
import { useHttp } from './http.hook';

export const useAuth = () => {
    const { request } = useHttp();
    const navigate = useNavigate();
    // const [user, setUser] = useState(undefined);
    // const user = useSelector((state: AllStateTypes) => state.user.item);
    const login = useCallback(
        async (from?) => {
            userService.pending();
            const response = await request('/auth/user', 'GET', null);
            if (response) {
                userService.success();
                userService.setUser(response);

                // setUser(response);
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

    // useEffect(() => {
    //     login();
    // }, [login]);

    const value = {
        login,
        logout,
    };

    return value;
};
