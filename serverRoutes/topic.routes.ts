/* eslint-disable import/no-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
// Запрещен await in loop
/* eslint-disable no-await-in-loop */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import authMiddleware from 'src/server/auth.middleware';
import User from '../serverModels/user';
import Topic from '../serverModels/topic';
import { cleanerBase } from './cleaner';

const router = Router();

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        const topic = new Topic({ ...req.body, ...{ user } });
        await topic.save();
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.get('/read', async (req, res) => {
    // cleanerBase();
    try {
        const topic = await Topic.find().populate('user');
        res.status(200).json(topic);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', authMiddleware, async (req, res) => {
    try {
        const { _id } = req.body;
        const { user } = await Topic.findOne({ _id });
        if (user._id.toJSON() === req.user.userId) {
            await Topic.updateOne({ _id }, { $set: req.body });
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(400).json({ message: 'Denied' });
        }
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/delete', authMiddleware, async (req, res) => {
    try {
        const { _id } = req.body;
        const { user } = await Topic.findOne({ _id });
        if (user._id.toJSON() === req.user.userId) {
            await Topic.deleteOne({ _id });
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(400).json({ message: 'Denied' });
        }
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
