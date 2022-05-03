/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/extensions */
const { getUser, getSocket } = require('./usersOnline');

module.exports = (socket) => {
    const sendInvite = async (id) => {
        socket.to(await getSocket(id)).emit('invite:recive', {
            user: await getUser(socket.id),
            socketId: socket.id,
        });
    };

    const acceptInvite = async (socketId) => {
        socket.to(socketId).emit('invite:accept', {
            user: await getUser(socket.id),
            socketId: socket.id,
        });
    };

    const cancelInvite = async (socketId) => {
        socket.to(socketId).emit('invite:cancel', {
            user: await getUser(socket.id),
        });
    };

    socket.on('invite:send', sendInvite);
    socket.on('invite:accept', acceptInvite);
    socket.on('invite:cancel', cancelInvite);
};
