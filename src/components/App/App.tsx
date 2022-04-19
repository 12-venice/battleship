import { AuthProvider } from 'src/context/Authprovider';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import './App.scss';

export const App = (): JSX.Element => {
    const routes = useRoutes();

    return (
        <AuthProvider>
            <ErrorBoundary>{routes}</ErrorBoundary>
        </AuthProvider>
    );
};
