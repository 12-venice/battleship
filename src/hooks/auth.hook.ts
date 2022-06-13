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
    const { search } = useLocation();
    const message = useMessage();
    const { request, error, clearError } = useHttp();
    const navigate = useNavigate();
    const { pathname, state } = useLocation();
    const code = /code=([^&]+)/.exec(search);
    const from =
        (state as FromProps)?.from?.pathname !== PageLinks.auth
            ? (state as FromProps)?.from?.pathname
            : null;

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

    const login = useCallback(
        (jwtToken) => {
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
            if (pathname === (PageLinks.auth || PageLinks.register)) {
                navigate(from || PageLinks.home, { replace: true });
            }
        },
        [_getUserInfo, from, navigate, pathname],
    );

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
        const data = JSON.parse(localStorage.getItem(STORAGE_NAME)!);

        if (data && data.token) {
            login(data.token);
        }
    }, [login]);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

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
