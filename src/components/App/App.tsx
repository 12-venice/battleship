/* eslint-disable react-hooks/exhaustive-deps */
import { hot } from 'react-hot-loader/root';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { Listener } from '../utils/Socket/Listeners';
import './App.scss';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const { pathname } = useLocation();
    console.log(pathname)
    const position = 'top-right';
    const navigation = useNavigate();
    Listener(navigation, pathname);

    return (
        <ErrorBoundary>
            <Toast position={position} />
            {routes}
        </ErrorBoundary>
    );
};

export const App = hot(AppWithRoutes);
