/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageLinks } from 'src/components/utils/Routes/types';
import { socket } from 'src/components/utils/Socket/Socket';
import { userService } from 'src/store/services/userService';
import { useHttp } from './http.hook';

export const STORAGE_NAME = 'bShipData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { request } = useHttp();
    const code = /code=([^&]+)/.exec(location.search);
    const _getUserInfo = useCallback(
        async (jwtToken: string) => {
            const userInfo = await request('/api/user/info', 'GET', null, {
                Authorization: `Bearer ${jwtToken}`,
            });
            userService.success();
            userService.setUser(userInfo);
        },
        [request],
    );

    const login = useCallback((jwtToken, from?) => {
        setToken(jwtToken);
        localStorage.setItem(
            STORAGE_NAME,
            JSON.stringify({
                token: jwtToken,
            }),
        );
        _getUserInfo(jwtToken);
        socket.auth = { jwtToken };
        socket.connect();
        const origin = from || PageLinks.home;
        navigate(origin);
    }, []);

    const RequestTokenOauth = useCallback(
        async (reqCode: string) => {
            const jwtToken = await request('/api/auth/oauth', 'POST', {
                code: reqCode,
            });
            if (jwtToken) {
                login(jwtToken);
            }
        },
        [login, request],
    );

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem(STORAGE_NAME);
        userService.setUser(null);
        socket.disconnect();
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_NAME) as string);
        if (data && data.token) {
            login(data.token);
        }
    }, [login]);

    useEffect(() => {
        if (!token && code && code[1]) {
            RequestTokenOauth(code[1] as unknown as string);
        }
    }, [RequestTokenOauth, code, token]);

    socket.on('connect_error', (err) => {
        if (err.message === 'TokenExpiredError') {
            logout();
        }
    });

    return { login, logout, token, RequestTokenOauth };
};
