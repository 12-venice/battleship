import { useEffect } from 'react';
import { useMessage } from 'src/hooks/message.hook';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import { socket } from '../utils/Socket/Socket';
import './App.scss';

export const App = (): JSX.Element => {
    const routes = useRoutes();
    const message = useMessage();
    const acceptInvite = (socketId: string) => {
        socket.emit('invite:accept', socketId);
    };

    useEffect(() => {
        socket.on('invite:accept', (data) => {
            message(`${data.user.display_name} accepted the invitation`);
        });
        socket.on('invite:recive', (data) => {
            message(
                `<span>${data.user.display_name}</span>
                <span>invites you to play</span>
                <button ${(onclick = () => acceptInvite(data.socketId))} 
                class="btn-flat green">Agree</button>`,
            );
        });
    }, [message]);
    return <ErrorBoundary>{routes}</ErrorBoundary>;
};
