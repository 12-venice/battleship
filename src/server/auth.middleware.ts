/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
/* eslint-disable import/no-default-export */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../webpack/env';

export default (req: Request, res: Response, next: () => void) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req!.headers!.authorization!.split(' ')[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: 'Пользователь не авторизован' });
        }
        jwt.verify(token, SECRET_KEY, (err: any, decoded) => {
            if (err && err.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Срок действия токена истек' });
            }
            if (decoded) {
                req.user = decoded;
                next();
            } else {
                return res
                    .status(401)
                    .json({ message: 'Пользователь не распознан' });
            }
        });
    } catch (e) {
        return res.status(401).json({ message: 'Нет авторизации' });
    }
};
