/* eslint-disable import/no-default-export */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import authMiddleware from 'src/server/auth.middleware';
import User from '../serverModels/user';
import Room from '../serverModels/room';

const router = Router();

router.post('/:id', authMiddleware, async (req, res) => {
    try {
        const data = await Room.findOne({ _id: req.params.id }).populate(
            'users',
        );
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});


export default router;
