import { Router } from 'express';
import authMiddleware from '../src/server/auth.middleware';
import { io } from '../src/server';
import User from '../serverModels/user';
import Room from '../serverModels/room';
import { getSocketUserOnline } from '../socketRoutes/usersOnline';

const router = Router();

router.post('/accept', authMiddleware, async (req, res) => {
    try {
        const { createdUserId, invitedUserId } = req.body;
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
            io.to(socketInvitedUser as string).emit('invite:recive', {
                user: createdUser,
                room,
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
            // io. join(room); // как добавить комнату в сокет
            sendInvite(room);
        } else {
            // isRoomCreate
            //     ? sendInvite(isRoomCreate)
            //     : sendInvite(isRoomCreateInvited);
        }
        res.status(200);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/invite', async (req, res) => {
    try {
        const { createdUserId, invitedUserId } = req.body;
        const createdUser = await User.findOne({ _id: createdUserId });
        const invitedUser = await User.findOne({ _id: invitedUserId });
        // const isRoomCreate = await Room.findOne({
        //     users: [createdUser, invitedUser],
        // });
        // const isRoomCreateInvited = await Room.findOne({
        //     users: [invitedUser, createdUser],
        // });
        const socketInvitedUser = getSocketUserOnline(invitedUserId);
        // const sendInvite = (room: string) => {
        io.to(socketInvitedUser as string).emit('game:invite', {
            from: createdUser,
            to: invitedUser,
        });
        // };
        // if (!isRoomCreate && !isRoomCreateInvited) {
        //     const room = new Room({ users: [createdUser, invitedUser] });
        //     await room.save();
        //     await User.updateOne(
        //         { _id: createdUserId },
        //         { $push: { rooms: room } },
        //     );
        //     await User.updateOne(
        //         { _id: invitedUserId },
        //         { $push: { rooms: room } },
        //     );
        //     io. join(room); // как добавить комнату в сокет
        //     sendInvite(room);
        // } else {
        //     isRoomCreate
        //         ? sendInvite(isRoomCreate)
        //         : sendInvite(isRoomCreateInvited);
        // }
        res.status(200);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
