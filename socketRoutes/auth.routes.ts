/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-default-export */
import { Socket } from 'socket.io';
import { io } from 'src/server';
import Room from 'serverModels/room';
import {
    addUserOnline,
    getSocketUserOnline,
    getUserOnline,
    removeUserOnline,
} from './usersOnline';
import User from '../serverModels/user';

export default (socket: Socket) => {
    socket.on('userOnline:add', async (id) => {
        addUserOnline(socket.id, id);
        const user = await User.findOne({ _id: id });
        const onlineFriends = {};

        const joinToRoom = async (room: { _id: string }) => {
            const roomId = room._id.toString();
            socket.join(roomId);
            socket.broadcast.to(roomId).emit('userOnline:add', {
                socketId: socket.id,
                id,
            });
            const { users } = await Room.findOne({ _id: roomId });
            const anotherUserId = users.indexOf(id) === 0 ? users[1] : users[0];
            const anotherUserSocket = getSocketUserOnline(anotherUserId);
            anotherUserSocket && {
                ...onlineFriends,
                ...{ [anotherUserSocket]: anotherUserId },
            };
        };
        if (user && user.rooms) {
            await user.rooms.forEach(joinToRoom);
        }
        io.to(socket.id).emit('userOnline:set', onlineFriends);
        console.log(io.sockets.adapter.rooms);
    });

    socket.on('userOnline:remove', async () => {
        const id = getUserOnline(socket.id);
        const user = await User.findOne({ _id: id });
        const leaveFromRoom = (room: { _id: string }) => {
            const roomId = room._id.toString();
            socket.leave(roomId);
            console.log('User LEAVE from room: ', roomId);
            io.to(roomId).emit('userOnline:remove', socket.id);
        };
        if (user && user.rooms) {
            user.rooms.forEach(leaveFromRoom);
        }
        removeUserOnline(socket.id);
    });

    socket.on('disconnect', async (reason: string) => {
        const id = getUserOnline(socket.id);
        const user = await User.findOne({ _id: id });
        const leaveFromRoom = (room: { _id: string }) => {
            const roomId = room._id.toString();
            socket.leave(roomId);
            console.log('User DISCONNECT from room: ', roomId, reason);
            io.to(roomId).emit('userOnline:remove', socket.id);
        };
        if (user && user.rooms) {
            user.rooms.forEach(leaveFromRoom);
        }
        removeUserOnline(socket.id);
    });
};
