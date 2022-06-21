import { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AllStateTypes } from 'src/store/reducers';
import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { PageLinks } from '../utils/Routes/types';
import './App.scss';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const position = 'top-right';
    const startGameRoom = useSelector(
        (state: AllStateTypes) => state.game.room,
    );
    const navigate = useNavigate();
    useEffect(() => {
        if (startGameRoom) navigate(`${PageLinks.game}/${startGameRoom}`);
    }, [startGameRoom]);

    return (
        <ErrorBoundary>
            <Toast position={position} />
            {routes}
        </ErrorBoundary>
    );
};

export const App = hot(AppWithRoutes);
