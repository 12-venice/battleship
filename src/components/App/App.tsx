import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import './App.scss';

export const App = (): JSX.Element => {
    const routes = useRoutes();

    return (
        <ErrorBoundary>
            <Toast />
            {routes}
        </ErrorBoundary>
    );
};
