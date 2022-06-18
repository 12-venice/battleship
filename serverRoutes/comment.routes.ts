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
import Topic from '../serverModels/topic';
import Comment from '../serverModels/comment';

const router = Router();

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { topic, comment } = req.body;
        const user = await User.findOne({ _id: req.user.userId });
        let findTopicOrComment;
        let newComment;
        if (topic) {
            findTopicOrComment = await Topic.findOne({ topic });
            newComment = new Comment({
                ...{ user },
                ...{ topic: findTopicOrComment },
                ...req.body,
            });
            await newComment.save();
            res.status(200).json({ message: 'OK' });
        }
        if (comment) {
            findTopicOrComment = await Comment.findOne({ comment });
            newComment = new Comment({
                ...{ user },
                ...{ comment: findTopicOrComment },
                ...req.body,
            });
            await newComment.save();
            await Comment.updateOne(
                { _id: comment },
                { $push: { subcomments: newComment } },
            );
            res.status(200).json({ message: 'OK' });
        }
        res.status(500).json({
            message: 'Неоходимо выбрать комментарий или топик',
        });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/read', async (req, res) => {
    try {
        const { _id } = req.body;
        const comments = await Comment.find({ topic: _id })
            .populate('user')
            .populate('subcomments');
        res.status(200).json(comments);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', authMiddleware, async (req, res) => {
    try {
        const { _id } = req.body;
        const { user } = await Comment.findOne({ _id });
        if (user._id.toJSON() === req.user.userId) {
            await Comment.updateOne({ _id }, { $set: req.body });
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
        const { user } = await Comment.findOne({ _id });
        if (user._id.toJSON() === req.user.userId) {
            await Comment.deleteOne({ _id });
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
