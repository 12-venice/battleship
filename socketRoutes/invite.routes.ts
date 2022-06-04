/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/extensions */
import User from '../serverModels/user';
import Room from '../serverModels/room';
import { Socket } from 'socket.io';
import { getSocketUserOnline, getUserOnline } from './usersOnline';

type roomUsers = {
    createdUserId: string;
    invitedUserId: string;
};

export default (socket: Socket) => {
    const sentInvite = async ({ createdUserId, invitedUserId }: roomUsers) => {
        const createdUser = await User.findOne({ _id: createdUserId });
        const invitedUser = await User.findOne({ _id: invitedUserId });
        const isRoomCreate = await Room.findOne({
            users: [createdUser, invitedUser],
        });
        const isRoomCreateInvited = await Room.findOne({
            users: [invitedUser, createdUser],
        });
        const socketInvitedUser = getSocketUserOnline(invitedUserId);
        const sendInvite = (room: string) => {
            console.log('socketInvitedUser: ', socketInvitedUser)
            socket.to(socketInvitedUser as string).emit('invite:recive', {
                user: createdUser,
                room: room,
            });
        };
        if (!isRoomCreate && !isRoomCreateInvited) {
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
            socket.join(room);
            sendInvite(room);
        } else {
            isRoomCreate
                ? sendInvite(isRoomCreate)
                : sendInvite(isRoomCreateInvited);
        }
    };

    const acceptInvite = async (socketId: string) => {
        socket.to(socketId).emit('invite:accept', {
            user: getUserOnline(socket.id),
            socketId: socket.id,
        });
    };

    const cancelInvite = async (socketId: string) => {
        socket.to(socketId).emit('invite:cancel', {
            user: getUserOnline(socket.id),
        });
    };

    socket.on('invite:sent', sentInvite);
    socket.on('invite:accept', acceptInvite);
    socket.on('invite:cancel', cancelInvite);
};
