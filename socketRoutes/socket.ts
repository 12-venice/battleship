/* eslint-disable no-console */
import authRoutes from './auth.routes';
import messageRoutes from './message.routes';
import inviteRoutes from './invite.routes';

export default (io) => {
    io.on('connection', (socket) => {
        console.log(socket.id);
        authRoutes(socket);
        messageRoutes(socket);
        inviteRoutes(socket);
    });

    io.engine.on('connection_error', (err) => {
        console.log('REQUEST: ', err.req);
        console.log('CODE: ', err.code);
        console.log('MESSAGE: ', err.message);
        console.log('CONTEXT: ', err.context);
    });
};
