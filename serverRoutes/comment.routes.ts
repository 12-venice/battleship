/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import User from '../serverModels/user';
import Topic from '../serverModels/topic';
import Comment from '../serverModels/comment';

const router = Router();

router.post('/create', async (req, res) => {
    try {
        const { id, topic } = req.body;
        const user = await User.findOne({ id });
        const topicFind = await Topic.findOne({ topic });
        const comment = new Comment({
            ...{ user: user._id },
            ...{ topic: topicFind },
            ...req.body,
        });
        await comment.save();
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/read', async (req, res) => {
    try {
        const { _id } = req.body;
        const comments = await Comment.find({ topic: _id });
        for (let i = 0; i < comments.length; i++) {
            const userComment = await User.findOne({
                _id: comments[i].toJSON().user,
            });
            comments[i] = {
                ...comments[i].toJSON(),
                ...{ user: userComment },
            };
        }
        res.json(comments);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', async (req, res) => {
    try {
        await Comment.findOneAndUpdate({ id: req.body.id }, { $set: req.body });
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
