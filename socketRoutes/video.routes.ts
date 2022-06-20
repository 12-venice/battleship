/* eslint-disable import/no-default-export */
import { Socket } from 'socket.io';
import { io } from '../src/server';
import { getSocket } from './auth.routes';

export default (socket: Socket) => {
    socket.on('call:sent', (data) => {
        io.to(getSocket(data.userToCall) as string).emit('call:recived', {
            signal: data.signalData,
            from: data.from,
        });
    });

    socket.on('call:accept', (data) => {
        io.to(getSocket(data.to) as string).emit('call:accept', data.signal);
    });
};
