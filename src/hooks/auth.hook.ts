/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { PageLinks } from 'src/components/utils/Routes/types';
import {
    ClientToServerEvents,
    ServerToClientEvents,
} from 'src/components/utils/Socket/types';
import { userService } from 'src/store/services/userService';
import { useHttp } from './http.hook';

export const STORAGE_NAME = 'bShipData';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
    closeOnBeforeunload: true,
    transports: ['polling'],
});

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
        if (jwtToken) {
            socket.auth = { jwtToken };
            socket.connect();
        }
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

    useEffect(() => {
        if (socket.connected) {
            socket.on('connect_error', (err: Error) => {
                if (err.message === 'TokenExpiredError') {
                    logout();
                }
            });
        }
        return () => {
            socket.off('connect_error', (err: Error) => {
                if (err.message === 'TokenExpiredError') {
                    logout();
                }
            });
        };
    }, [socket.connected]);

    return { login, logout, token, RequestTokenOauth, socket };
};
