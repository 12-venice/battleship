/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/extensions */
import { ISocket } from 'src/server/types';
import User from '../serverModels/user';
import Room from '../serverModels/room';
import { getUsers } from './auth.routes';

export default async (socket: ISocket) => {
    const sentInvite = async (invitedUserId: string) => {
        const user = await User.findOne(
            {
                _id: socket.userID,
            },
            { password: 0 },
        );
        const isRoomCreate = await Room.findOne({
            users: [invitedUserId, socket.userID],
        });
        const isInviteRoomCreate = await Room.findOne({
            users: [socket.userID, invitedUserId],
        });
        if (!isRoomCreate && !isInviteRoomCreate) {
            const room = new Room({ users: [socket.userID, invitedUserId] });
            await room.save();
            await User.updateOne(
                { _id: socket.userID },
                { $push: { rooms: room._id } },
            );
            await User.updateOne(
                { _id: invitedUserId },
                { $push: { rooms: room._id } },
            );
            const invitedUserSocket = getUsers()!.find(
                (userSocket) => userSocket.id === invitedUserId,
            )!.socket;
            invitedUserSocket?.join(room._id.toString());
            socket.join(room._id.toString());
            socket.to(room._id.toString()).emit('invite:recive', user);
        } else {
            socket
                .to(
                    isRoomCreate?._id.toString() ||
                        isInviteRoomCreate?._id.toString(),
                )
                .emit('invite:recive', user);
        }
    };

    const acceptInvite = (socketId: string) => {
        socket.to(socketId).emit('invite:accept', {
            socketId: socket.id,
        });
    };

    const cancelInvite = (socketId: string) => {
        socket.to(socketId).emit('invite:cancel', {
            user: null,
        });
    };

    const randomInvite = async () => {
        const user = await User.findOne(
            {
                _id: socket.userID,
            },
            { password: 0 },
        );
        socket.broadcast.emit('invite:recive', user);
    };

    socket.on('invite:sent', sentInvite);
    socket.on('invite:accept', acceptInvite);
    socket.on('invite:cancel', cancelInvite);
    socket.on('invite:random', randomInvite);
};
