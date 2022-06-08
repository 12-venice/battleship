import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../../webpack/env';

export default (req: { method: string; headers: { authorization: string }; user: string | jwt.JwtPayload }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string }): void; new(): any } } }, next: () => void) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Пользователь не авторизован' })
        }
        jwt.verify(token, SECRET_KEY, (err: { name: string }, decoded) => {
            if (err && err.name === 'TokenExpiredError') {
                res.status(401).json({ message: err.name })
            }
            if (decoded) {
                req.user = decoded
                next()
            } else {
                res.status(401).json({ message: 'Пользователь не распознан' })
            }
        });
    } catch (e) {
        res.status(401).json({ message: 'Нет авторизации' })
    }
}