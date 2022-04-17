import { AuthProvider } from 'src/context/Authprovider';
import { useRoutes } from '../utils/Routes';
import './App.scss';

export const App = (): JSX.Element => {
    const routes = useRoutes();

    return <AuthProvider>{routes}</AuthProvider>;
};
