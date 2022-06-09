/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useLocation } from 'react-router-dom';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { notificationService } from 'src/store/services/notificationService';
import { OnlineService } from 'src/store/services/onlineService';
import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { PageLinks } from '../utils/Routes/types';
import { socket } from '../utils/Socket/Socket';
import './App.scss';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const { location, search } = useLocation();
    const { request } = useHttp();
    const { login } = useAuth();
    const position = 'top-right';
    const code = /code=([^&]+)/.exec(search);

    const RequestTokenOauth = async (reqCode: string) => {
        const getToken = await request('/api/auth/oauth', 'POST', {
            code: reqCode,
        });

        if (getToken) {
            login(getToken);
        }
    };

    useEffect(() => {
        if (code && code[1]) {
            RequestTokenOauth(code[1] as unknown as string);
        }
    }, []);

    socket.on('userOnline:add', (data) => {
        OnlineService.addUserOnline(data);
    });

    socket.on('userOnline:remove', (data) => {
        OnlineService.removeUserOnline(data);
    });

    socket.on('userOnline:set', (data) => {
        OnlineService.setUserOnline(data);
    });

    socket.on('invite:accept', (data) => {
        notificationService.addNotification({
            title: data.user.display_name,
            message: 'Аccepted the invitation',
            autoDelete: false,
            autoDeleteTime: 5000,
            type: 'success',
            user: data.user,
        });
    });

    socket.on('invite:cancel', (data) => {
        notificationService.addNotification({
            title: data.user.display_name,
            message: 'Refused the invitation',
            autoDelete: true,
            autoDeleteTime: 5000,
            type: 'danger',
            user: data.user,
        });
    });

    socket.on('invite:recive', (data) => {
        notificationService.addNotification({
            title: data.user.display_name,
            message: 'Invites you to play',
            autoDelete: true,
            autoDeleteTime: 5000,
            user: data.user,
            buttons: [
                {
                    title: 'ACCEPT',
                    skin: 'small',
                    color: 'orange',
                    onClick: () => AcceptInvite(nav, data.room),
                },
                {
                    title: 'CANCEL',
                    skin: 'small',
                    color: 'red',
                    onClick: () => CancelInvite(data.room),
                },
            ],
        });
    });
    socket.on('messages:recive', (data) => {
        if (location.pathname !== `${PageLinks.game}/${data.room}`) {
            notificationService.addNotification({
                title: `New message by ${data.user.display_name}`,
                message: data.text,
                autoDelete: true,
                autoDeleteTime: 15000,
                user: data.user,
                buttons: [
                    {
                        title: 'READ',
                        skin: 'small',
                        color: 'green',
                    },
                ],
            });
        }
    });

    return (
        <ErrorBoundary>
            <Toast position={position} />
            {routes}
        </ErrorBoundary>
    );
};

export const App = hot(AppWithRoutes);
