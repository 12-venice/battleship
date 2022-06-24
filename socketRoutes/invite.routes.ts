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
            );
            if (invitedUserSocket) {
                invitedUserSocket.socket.join(room._id.toString());
            }
            socket.join(room._id.toString());
        }
    };

    socket.on('invite:sent', sentInvite);
};
