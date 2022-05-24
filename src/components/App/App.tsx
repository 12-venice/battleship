import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { hot } from "react-hot-loader/root";
import './App.scss';

const app: React.FC = () => {
    const routes = useRoutes();
    const position = 'top-right';
    const autoDelete = true;
    const autoDeleteTime = 30000;

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

export const App = hot(app);
