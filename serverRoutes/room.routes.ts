/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import User from '../serverModels/user';
import Room from '../serverModels/room';
import Message from '../serverModels/message';

const router = Router();

router.post('/read', async (req, res) => {
    try {
        const { userId, roomId } = req.body;
        const room = await Room.findOne({ _id: roomId });
        const anotherUserId =
            room.users.indexOf(userId) === 0 ? room.users[1] : room.users[0];
        const anotherUser = await User.findOne({ _id: anotherUserId });
        const messages = [];
        for (let i = 0; i < room.messages.length; i++) {
            const message = await Message.findOne({ _id: room.messages[i] });
            messages.push(message.toJSON());
        }
        res.status(200).json({ room, anotherUser, messages });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/find', async (req, res) => {
    try {
        const { _id, rooms } = req.body;
        const data = [];
        for (let i = 0; i < rooms.length; i++) {
            const { users } = await Room.findOne({ _id: rooms[i] });
            const anotherUserId =
                users.indexOf(_id) === 0 ? users[1] : users[0];
            const anotherUser = await User.findOne({ _id: anotherUserId });
            data.push({ ...anotherUser.toJSON(), ...{ room: rooms[i] } });
        }
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
