/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/extensions */
const { getUser, getSocket } = require('./usersOnline');
const User = require('../serverModels/user.ts');
const Room = require('../serverModels/room.ts');

module.exports = (socket) => {
    const createRoom = async ({ createdUserId, invitedUserId }) => {
        const createdUser = await User.findOne({ _id: createdUserId });
        const invitedUser = await User.findOne({ _id: invitedUserId });
        const isRoomCreate = await Room.findOne({ users: [createdUser, invitedUser] })
        if (!isRoomCreate) {
            const room = new Room({ users: [createdUser, invitedUser] });
            await room.save();
            await User.updateOne(
                { _id: createdUserId },
                { $push: { rooms: room } },
            );
            await User.updateOne(
                { _id: invitedUserId },
                { $push: { rooms: room } },
            );
        } else {
            console.log('Room is created!')
        };
        socket.to(await getSocket(invitedUserId)).emit('invite:recive', {
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

    socket.on('invite:send', createRoom);
    socket.on('invite:accept', acceptInvite);
    socket.on('invite:cancel', cancelInvite);
};
