/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';

import User from '../serverModels/user';

const router = Router();

router.post('/create', async (req, res) => {
    try {
        const { id } = req.body;
        setTimeout(() => {
        }, 500);
        if (!req.body.login) {
            req.body = { ...req.body, ...{ login: req.body.email } }
        }
        if (!req.body.display_name) {
            req.body = { ...req.body, ...{ display_name: req.body.login } }
        }
        const isExist = await User.findOne({ id });
        if (isExist) {
            await User.updateOne({ id }, { $set: req.body });
            res.status(200).json(isExist);
        } else {
            const user = new User(req.body);
            await user.save();
            res.status(201).json(user);
        }
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/read', async (req, res) => {
    try {
        const { sortType, sortDirection, page } = req.body;
        console.log(sortType, sortDirection, page)
        const user = await User.find()
            .sort({ [sortType]: sortDirection ? 1 : -1 })
            .skip(page * 10)
            .limit(10);
        res.json(user);
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/find', async (req, res) => {
    try {
        const { str } = req.body;
        const user = await User.find({
            $or: [
                { display_name: { $regex: str, $options: 'i' } },
                { first_name: { $regex: str, $options: 'i' } },
                { second_name: { $regex: str, $options: 'i' } },
                { email: { $regex: str, $options: 'i' } },
                { phone: { $regex: str, $options: 'i' } },
                { login: { $regex: str, $options: 'i' } },
            ],
        });
        res.json(user);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', async (req, res) => {
    try {
        await User.updateOne({ id: req.body.id }, { $set: req.body });
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        await User.deleteOne({ id });
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
