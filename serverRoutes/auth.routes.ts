import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../serverModels/user'
import { SECRET_KEY } from '../webpack/env'

const router = Router()

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