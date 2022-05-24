/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
import { users, getUsers } from './usersOnline';

export default (socket) => {
    socket.on('auth', async (id) => {
        users[socket.id] = id;
        socket.emit('online', await getUsers());
        socket.broadcast.emit('online', await getUsers());
    });
    socket.on('!auth', async () => {
        delete users[socket.id];
        socket.broadcast.emit('online', await getUsers());
    });
    socket.on('disconnect', async (reason) => {
        delete users[socket.id];
        console.log(reason, socket.id);
        socket.broadcast.emit('online', await getUsers());
    });
};
