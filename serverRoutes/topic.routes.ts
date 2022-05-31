/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
// Запрещен await in loop
/* eslint-disable no-await-in-loop */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import User from '../serverModels/user';
import Topic from '../serverModels/topic';
import Comment from '../serverModels/comment';
import Message from '../serverModels/message';
import Room from '../serverModels/room';
import Move from '../serverModels/move';

const router = Router();
const cleanerBase = async () => {
    User.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('User collection removed');
    });
    Topic.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Topic collection removed');
    });
    Comment.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Comment collection removed');
    });
    Message.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Message collection removed');
    });
    Move.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Room collection removed');
    });
    Room.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Room collection removed');
    });
};

router.post('/create', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.body.id });
        const { _id } = user;
        const topic = new Topic({ ...req.body, ...{ user: _id } });
        await topic.save();
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/read', async (req, res) => {
    //cleanerBase()
    try {
        const topic = await Topic.find();
        for (let index = 0; index < topic.length; index++) {
            const { user } = topic[index].toJSON();
            const userFind = await User.findOne({ _id: user });
            topic[index] = {
                ...topic[index].toJSON(),
                ...{ user: userFind },
            };
        }
        res.json(topic);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', async (req, res) => {
    try {
        await Topic.updateOne({ _id: req.body._id }, { $set: req.body });
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
        await Topic.deleteOne({ _id });
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
