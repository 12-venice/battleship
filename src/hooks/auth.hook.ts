/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FromProps, PageLinks } from 'src/components/utils/Routes/types';
import { socket } from 'src/components/utils/Socket/Socket';
import { userService } from 'src/store/services/userService';
import { useHttp } from './http.hook';
import { useMessage } from './message.hook';

export const STORAGE_NAME = 'bShipData';

export const useAuth = () => {
    const [token, setToken] = useState(null);

    const { request, error, clearError } = useHttp();
    const navigate = useNavigate();
    const { pathname, state } = useLocation();
    const from = (state as FromProps)?.from?.pathname;
    const message = useMessage();

    const _getUserInfo = useCallback(async () => {
        const userInfo = await request('/api/user/info', 'GET', null, {
            Authorization: `Bearer ${token}`,
        });
        userService.success();
        userService.setUser(userInfo);
        socket.emit('userOnline:add', userInfo._id);
        if (pathname === (PageLinks.auth && PageLinks.register)) {
            navigate(from || PageLinks.home, { replace: true });
        }
    }, [from, navigate, pathname, request, token]);

    const login = useCallback((jwtToken) => {
        setToken(jwtToken);
        localStorage.setItem(
            STORAGE_NAME,
            JSON.stringify({
                token: jwtToken,
            }),
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem(STORAGE_NAME);
        userService.setUser(null);
        socket.emit('userOnline:remove');
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_NAME)!);

        if (data && data.token) {
            login(data.token);
        }
    }, [login]);

    useEffect(() => {
        if (token) {
            _getUserInfo();
        }
    }, [token, _getUserInfo]);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    return { login, logout, token };
};
