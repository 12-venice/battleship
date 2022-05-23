import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import './App.scss';

export const App = (): JSX.Element => {
    const routes = useRoutes();
    const position = 'top-right';
    const autoDelete = true;
    const autoDeleteTime = 3000;

    return (
        <ErrorBoundary>
            <Toast
                position={position}
                autoDelete={autoDelete}
                autoDeleteTime={autoDeleteTime}
            />
            {routes}
        </ErrorBoundary>
    );
};
