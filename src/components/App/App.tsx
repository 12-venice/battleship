/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHttp } from 'src/hooks/http.hook';
import { userService } from 'src/store/services/userService';
import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { PageLinks } from '../utils/Routes/types';
import { Listener } from '../utils/Socket/Listeners';
import { socket } from '../utils/Socket/Socket';
import './App.scss';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const { pathname, search } = useLocation();
    const { request } = useHttp();
    const position = 'top-right';
    const navigation = useNavigate();
    Listener(navigation, pathname);
    const code = /code=([^&]+)/.exec(search);

    const RequestTokenOauth = async (reqCode: string) => {
        const responseServer = await request(
            '/api/user/oauth',
            'POST',
            { code: reqCode },
            {},
            true,
        );
        if (responseServer) {
            userService.success();
            userService.setUser(responseServer);
            socket.emit('userOnline:add', responseServer._id);
        }
    };

    useEffect(() => {
        if (code && code[1]) {
            RequestTokenOauth(code[1] as unknown as string);
        }
    }, []);

    return (
        <ErrorBoundary>
            <Toast position={position} />
            {routes}
        </ErrorBoundary>
    );
};

export const App = hot(AppWithRoutes);
