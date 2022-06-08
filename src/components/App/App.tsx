/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { Listener } from '../utils/Socket/Listeners';
import './App.scss';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const { pathname, search } = useLocation();
    const { request } = useHttp();
    const { login } = useAuth();
    const position = 'top-right';
    const navigation = useNavigate();
    Listener(navigation, pathname);
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

    return (
        <ErrorBoundary>
            <Toast position={position} />
            {routes}
        </ErrorBoundary>
    );
};

export const App = hot(AppWithRoutes);
