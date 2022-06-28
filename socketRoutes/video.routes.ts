/* eslint-disable import/no-default-export */
import User from 'serverModels/user';
import { Socket } from 'socket.io';
import { io } from '../src/server';
import { getSocket } from './auth.routes';

export default (socket: Socket) => {
    socket.on('call:sent', async (data) => {
        console.log(getSocket(data.userToCall), data.from);
        const user = await User.findOne({ _id: data.from });
        io.to(getSocket(data.userToCall) as string).emit('call:recived', {
            signal: data.signalData,
            from: user,
        });
    });

    socket.on('call:accept', (data) => {
        console.log('ACCEPT');
        io.to(getSocket(data.to) as string).emit('call:accept', data.signal);
    });

    socket.on('call:cancel', (data) => {
        console.log('CANCEL');
        io.to(getSocket(data.to) as string).emit('call:cancel', data.signal);
    });
};
