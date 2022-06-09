/* eslint-disable import/no-default-export */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import Message from '../serverModels/message';

const router = Router();

router.post('/read', async (req, res) => {
    try {
        const { room } = req.body;
        const messages = await Message.find({ room }).populate('user');
        res.status(200).json(messages);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/setdelivered', async (req, res) => {
    try {
        const { _id } = req.body;
        await Message.updateOne({ _id }, { $set: { delivered: true } });
        res.status(200).json({ message: 'OK' });;
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', async (req, res) => {
    try {
        await Message.updateOne(
            { _id: req.body.id },
            { $set: { delivered: true } },
        );
        res.status(200).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/delete', async (req, res) => {
    try {
        const { _id } = req.body;
        await Message.deleteOne({ _id });
        res.status(204).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
