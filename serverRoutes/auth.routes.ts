/* eslint-disable import/no-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../serverModels/user';
import { SECRET_KEY } from '../webpack/env';
import { getToken, getUserInfo } from '../src/server/request';

const router = Router();

router.post('/oauth', async (req, res) => {
    try {
        const { code } = req.body;
        getToken(
            code,
            (result: { access_token: string; token_type: string }) => {
                if (result.token_type && result.access_token) {
                    getUserInfo(
                        result.token_type,
                        result.access_token,
                        async (user: {
                            email: string;
                            default_email?: string;
                            phone: string;
                            default_phone?: string;
                            id: string;
                            display_name?: string;
                            login?: string;
                        }) => {
                            // переименование полей для стандартизации User
                            if (user.default_email) {
                                user.email = user.default_email;
                                delete user.default_email;
                            }
                            if (user.default_phone) {
                                user.phone = user.default_phone;
                                delete user.default_phone;
                            }
                            if (!user.login) {
                                user.login = user.email;
                            }
                            if (!user.display_name) {
                                user.display_name = user.login;
                            }

                            const isExist = await User.findOne({
                                email: user.email,
                            });
                            let userID = isExist ? isExist._id : '';
                            if (!isExist) {
                                const userCreate = new User(user);
                                await userCreate.save();
                                userID = userCreate._id;
                            }
                            const token = jwt.sign(
                                { userId: userID },
                                SECRET_KEY,
                                { expiresIn: '30d' },
                            );
                            res.status(200).json(token);
                        },
                    );
                }
            },
        );
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const isExist = await User.findOne({ email: email.toLowerCase() });

        if (!isExist) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        if (!isExist.password) {
            return res
                .status(400)
                .json({ message: 'Для входа используйте Яндекс.ID' });
        }

        const isMatch = await bcrypt.compare(password, isExist.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }

        const token = jwt.sign({ userId: isExist.id }, SECRET_KEY, {
            expiresIn: '30d',
        });
        res.status(200).json(token);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
