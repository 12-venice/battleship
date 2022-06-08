import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../serverModels/user'
import { SECRET_KEY } from '../webpack/env'
import { getToken, getUserInfo } from '../src/server/request';

const router = Router()

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
                            default_email: string;
                            phone: string;
                            default_phone: string;
                            id: string;
                        }) => {
                            // переименование полей для стандартизации User
                            user.email = user.default_email;
                            delete user.default_email;
                            user.phone = user.default_phone;
                            delete user.default_phone;
                            const isExist = await User.findOne({ id: user.id });
                            if (isExist) {
                                await User.updateOne(
                                    { id: user.id },
                                    { $set: user },
                                );
                            } else {
                                const userCreate = new User(user);
                                await userCreate.save();
                            }
                            const token = jwt.sign(
                                {userId: user.id},
                                SECRET_KEY,
                                {expiresIn: '9h'}
                            )
                    
                            res.json({ token, userId: user.id })
                        },
                    );
                }
            },
        );
        res.status(200);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const {login, password} = req.body

        const user = await User.findOne({login: login})

        if (!user) {
            return res.status(400).json({message: 'Пользователь не найден'})
        }

        const isMatch = await bcrypt.compare(password, user.token)

        if (!isMatch) {
            return res.status(400).json({message: 'Неверный пароль'})
        }
        
        const token = jwt.sign(
            {userId: user.id},
            SECRET_KEY,
            {expiresIn: '9h'}
        )

        res.json({ token, userId: user.id })

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте еще раз'})
    }
})

export default router