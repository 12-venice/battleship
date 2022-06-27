/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-constructed-context-values */
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AllStateTypes } from 'src/store/reducers';
import { useEffect, useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import { useAuth } from 'src/hooks/auth.hook';
import { io, Socket } from 'socket.io-client';
import { Toast } from '../Toast';
import { AuthContext } from '../utils/Context/AuthContext';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { PageLinks } from '../utils/Routes/types';
import { SocketListener } from '../utils/Socket/Socket';
import './App.scss';
import {
    ClientToServerEvents,
    ServerToClientEvents,
} from '../utils/Socket/types';

const AppWithRoutes: React.FC = () => {
    const routes = useRoutes();
    const position = 'top-right';
    const startGameRoom = useSelector(
        (state: AllStateTypes) => state.game.room,
    );
    const navigate = useNavigate();
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
        autoConnect: false,
    });

    const socketRef = useRef(socket);

    useEffect(() => {
        if (startGameRoom) navigate(`${PageLinks.game}/${startGameRoom}`);
    }, [startGameRoom]);
    const { token, login, logout } = useAuth(socketRef.current);

    useEffect(() => {
        SocketListener(socketRef.current);
    }, []);

    return (
        <AuthContext.Provider
            value={{ token, login, logout, socket: socketRef.current }}
        >
            <ErrorBoundary>
                <Toast position={position} />
                {routes}
            </ErrorBoundary>
        </AuthContext.Provider>
    );
};

export const App = hot(AppWithRoutes);
