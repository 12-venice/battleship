/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { Listener } from '../utils/Socket/Listeners';
import './App.scss';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const position = 'top-right';
    const navigation = useNavigate();
    const location = useLocation();
    Listener(navigation);
    const getData = async (token: string[]) => {
        const data = await fetch('https://login.yandex.ru/info?format=json', {
            method: 'GET',
            headers: {
                Authorization: `OAuth ${token[1]}`,
            },
        });
        console.log(data);
    };
    useEffect(() => {
        const token = /access_token=([^&]+)/.exec(location.hash);
        if (token) {
            getData(token);
        }
    }, [location.hash]);

    return (
        <ErrorBoundary>
            <Toast position={position} />
            {routes}
        </ErrorBoundary>
    );
};

export const App = hot(AppWithRoutes);
