/* eslint-disable no-param-reassign */
/* eslint-disable import/no-default-export */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import authMiddleware from 'src/server/auth.middleware';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUsers } from 'socketRoutes/auth.routes';
import { SECRET_KEY } from '../webpack/env';
import User from '../serverModels/user';

const router = Router();

router.post('/generate', async (req, res) => {
    try {
        const { retrypassword, password } = req.body;

        if (retrypassword !== password) {
            return res.status(400).json({
                message: 'Пароль не совпадает',
            });
        }

        const isExist = await User.findOne({
            email: req.body.email.toLowerCase(),
        });

        if (isExist) {
            return res.status(400).json({
                message: 'Пользователь с таким E-mail уже зарегистрирован',
            });
        }

        if (!req.body.login) {
            req.body.login = req.body.email;
        }
        if (!req.body.display_name) {
            req.body.display_name = req.body.login;
        }

        const hashedPassword = await bcrypt.hash(password, 15);
        const user = new User({
            ...req.body,
            ...{ password: hashedPassword },
        });

        await user.save();

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
            expiresIn: '30d',
        });

        return res.status(200).json(token);
    } catch (e) {
        return res
            .status(500)
            .json({ message: 'Что-то пошло не так, попробуйте еще раз' });
    }
});

router.post('/read', async (req, res) => {
    try {
        const { sortType, sortDirection, page } = req.body;
        const user = await User.find({}, { password: 0 })
            .sort({ [sortType]: sortDirection ? 1 : -1 })
            .skip(page * 10)
            .limit(10);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/find', async (req, res) => {
    try {
        const { str } = req.body;
        const user = await User.find(
            {
                $or: [
                    { display_name: { $regex: str, $options: 'i' } },
                    { first_name: { $regex: str, $options: 'i' } },
                    { second_name: { $regex: str, $options: 'i' } },
                    { email: { $regex: str, $options: 'i' } },
                    { phone: { $regex: str, $options: 'i' } },
                    { login: { $regex: str, $options: 'i' } },
                ],
            },
            { password: 0 },
        );
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.get('/online', async (req, res) => {
    try {
        const onlineUsersID = getUsers().map((s) => s.id);
        const onlineUsers = await User.find(
            { _id: { $in: onlineUsersID } },
            {
                password: 0,
                defeats: 0,
                points: 0,
                wins: 0,
            },
        );
        return res.status(200).json(onlineUsers);
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', authMiddleware, async (req, res) => {
    try {
        await User.updateOne({ _id: req.user.userId }, { $set: req.body });
        const user = await User.findOne({ _id: req.user.userId });
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/password', authMiddleware, async (req, res) => {
    try {
        const { oldpassword, password } = req.body;
        const user = await User.findOne({ _id: req.user.userId });
        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if (isMatch) {
            await User.updateOne(
                { _id: req.user.userId },
                { $set: { password } },
            );
            return res.status(200).json({ message: 'OK' });
        }
        return res.status(400).json({
            message: 'Пароль неправильный',
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/delete', authMiddleware, async (req, res) => {
    try {
        await User.deleteOne({ _id: req.user.userId });
        return res.status(200).json({ message: 'OK' });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.get('/info', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
