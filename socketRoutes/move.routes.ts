/* eslint-disable import/no-default-export */
import { Socket } from 'socket.io';
import { io } from '../src/server';

export default (socket: Socket) => {
    socket.emit(
        'move:sent',
        async ({ roomID, data }: { roomID: string; data: {} }) => {
            io.in(roomID).emit('move:recive', data);
        },
    );
};
