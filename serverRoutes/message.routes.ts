/* eslint-disable import/no-default-export */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import { io } from 'src/server';
import authMiddleware from 'src/server/auth.middleware';
import Message from '../serverModels/message';
import User from '../serverModels/user';
import Room from '../serverModels/room';

const router = Router();

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { room, message } = req.body;
        const user = await User.findOne(
            {
                _id: req.user.userId,
            },
            { password: 0 },
        );
        const newMessage = new Message({
            text: message,
            user,
            room,
        });

        await newMessage.save((err: string, obj: object) => {
            if (err) {
                return res.status(500).json({ message: 'Error' });
            }
            io.in(room).emit('messages:recived', obj);
        });
        await Room.updateOne(
            { _id: room },
            { $push: { messages: newMessage } },
        );
        return res.status(200).json({ message: 'OK' });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/read', async (req, res) => {
    try {
        const { room } = req.body;
        const messages = await Message.find({ room }).populate('user');
        return res.status(200).json(messages);
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/setdelivered', async (req, res) => {
    try {
        const { _id } = req.body;
        const message = await Message.findOne({ _id });
        await Message.updateOne({ _id }, { $set: { delivered: true } });
        io.in(message.room.toString()).emit('message:delivered', message._id);
        return res.status(200).json({ message: 'OK' });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', async (req, res) => {
    try {
        await Message.updateOne({ _id: req.body._id }, { $set: req.body });
        return res.status(200).json({ message: 'OK' });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/delete', async (req, res) => {
    try {
        const { _id } = req.body;
        await Message.deleteOne({ _id });
        return res.status(204).json({ message: 'OK' });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
