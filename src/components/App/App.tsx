import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AuthProvider } from 'src/context/Authprovider';
import { useAuth } from 'src/hooks/auth.hook';
import { AllStateTypes } from 'src/store/reducers';
import { ErrorBoundary } from '../utils/ErrorBoundary';

import { useRoutes } from '../utils/Routes';
import './App.scss';

export const App = (): JSX.Element => {
    const routes = useRoutes();
    // это тестовый код, позволяет наблюдать статус запросов авторизации usera
    const states = useSelector((state: AllStateTypes) => state.user.item);
    console.log(states);
    return <ErrorBoundary>{routes}</ErrorBoundary>;
};
