/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import User from '../serverModels/user';
import Room from '../serverModels/room';
import Comment from '../serverModels/comment';


const router = Router();

router.post('/create', async (req, res) => {
    try {
        const { createdUserId, invitedUserId } = req.body;
        const createdUser = await User.findOne({ _id: createdUserId });
        const invitedUser = await User.findOne({ _id: invitedUserId });
        const room = new Room({ users: [createdUser, invitedUser] });
        await room.save();
        res.status(201).json(room);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/read', async (req, res) => {
    try {
        const { _id, rooms } = req.body;
        const data = [];
        for (let i = 0; i < rooms.length; i++) {
            const { users } = await Room.findOne({ _id: rooms[i] });
            const anotherUserId =
                users.indexOf(_id) === 0 ? users[1] : users[0];
            const anotherUser = await User.findOne({ _id: anotherUserId });
            data.push(anotherUser);
        }
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', async (req, res) => {
    try {
        await Comment.updateOne({ id: req.body.id }, { $set: req.body });
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/delete', async (req, res) => {
    try {
        const { _id } = req.body;
        await Comment.deleteOne({ _id });
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
