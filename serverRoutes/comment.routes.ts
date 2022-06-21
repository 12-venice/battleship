/* eslint-disable import/no-default-export */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import authMiddleware from 'src/server/auth.middleware';
import Comment from '../serverModels/comment';

const router = Router();

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { comment } = req.body;
        const newComment = new Comment({
            ...req.body,
            ...{ user: req.user.userId },
        });
        await newComment.save();
        if (comment) {
            await Comment.updateOne(
                { _id: comment },
                { $push: { subcomments: newComment } },
            );
        }
        return res.status(200).json({ message: 'OK' });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/read', async (req, res) => {
    try {
        const { comment, topic } = req.body;
        let comments;
        if (comment) {
            comments = await Comment.find({ comment }).populate('user');
            return res.status(200).json(comments);
        }
        if (topic) {
            comments = await Comment.find({ topic }).populate('user');
            return res.status(200).json(comments);
        }
        return res.status(500).json({
            message: 'Неоходимо выбрать комментарий или топик',
        });
    } catch (e) {
        return res.status(500).json({
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
            return res.status(200).json({ message: 'OK' });
        }
        return res.status(400).json({ message: 'Denied' });
    } catch (e) {
        return res.status(500).json({
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
            await Comment.deleteMany({ comment: _id });
            return res.status(200).json({ message: 'OK' });
        }
        return res.status(400).json({ message: 'Denied' });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
