/* eslint-disable react-hooks/exhaustive-deps */
import { hot } from 'react-hot-loader/root';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { Listener } from '../utils/Socket/Listeners';
import './App.scss';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const position = 'top-right';
    const navigation = useNavigate();
    Listener(navigation);

    return (
        <ErrorBoundary>
            <Toast position={position} />
            {routes}
        </ErrorBoundary>
    );
};

export const App = hot(AppWithRoutes);
