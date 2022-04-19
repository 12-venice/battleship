import { useSelector } from 'react-redux';
import { AuthProvider } from 'src/context/Authprovider';
import { AllStateTypes } from 'src/store/reducers';
import { useRoutes } from '../utils/Routes';
import './App.scss';

export const App = (): JSX.Element => {
    const routes = useRoutes();
    // это тестовый код, позволяет наблюдать статус запросов авторизации usera
    const states = useSelector((state: AllStateTypes) => state.user.status);
    console.log(states);
    return <AuthProvider>{routes}</AuthProvider>;
};
