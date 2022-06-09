/* eslint-disable import/no-default-export */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import authMiddleware from 'src/server/auth.middleware';
import User from '../serverModels/user';
import Room from '../serverModels/room';

const router = Router();

router.get('/:id', async (req, res) => {
    try {
        const data = await Room.findOne({ _id: req.params.id }).populate(
            'users',
        );
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/find', authMiddleware, async (req, res) => {
    try {
        const { rooms } = req.body;
        const data = [];
        for (let i = 0; i < rooms.length; i++) {
            const { users } = await Room.findOne({ _id: rooms[i] });
            const anotherUserId =
                users.indexOf(req.user.userId) === 0 ? users[1] : users[0];
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
