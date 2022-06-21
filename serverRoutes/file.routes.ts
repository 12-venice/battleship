/* eslint-disable import/no-default-export */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import authMiddleware from 'src/server/auth.middleware';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { io } from 'src/server';
import User from '../serverModels/user';
import Message from '../serverModels/message';
import Room from '../serverModels/room';
import Comment from '../serverModels/comment';

const storage = multer.diskStorage({
    destination(req, file, callback) {
        const dir = file.fieldname;
        if (!fs.existsSync(path.join(__dirname, '../dist', dir))) {
            fs.mkdirSync(path.join(__dirname, '../dist', dir));
        }
        callback(null, path.join(__dirname, '../dist', dir));
    },
    filename(req, file, callback) {
        const fileExtension = file.originalname.split('.')[1] ?? 'jpg';
        callback(null, `${req.user.userId}_${uuidv4()}.${fileExtension}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            callback(null, true);
        } else {
            callback(null, false);
            return callback(
                new Error('Only .png, .jpg and .jpeg format allowed!'),
            );
        }
    },
}).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

const router = Router();

router.post('/avatar', authMiddleware, (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Произошла ошибка при загрузке файла',
                });
            }
            const { avatar } = await User.findOne({ _id: req.user.userId });
            const filePath = path.join(__dirname, '../dist', avatar);
            if (avatar && filePath) {
                fs.unlinkSync(filePath);
            }
            await User.updateOne(
                { _id: req.user.userId },
                {
                    $set: {
                        avatar: `/avatar/${req.files?.avatar[0].filename}`,
                    },
                },
            );
            return res.status(200).json({
                message: 'Файл успешно загружен',
            });
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/message/:id', authMiddleware, (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Произошла ошибка при загрузке файла',
                });
            }
            const newMessage = new Message({
                text: `/image/${req.files?.image[0].filename}`,
                user: req.user.userId,
                room: req.params.id,
            });
            await newMessage.save((e: Error, obj: object) => {
                if (e) {
                    return res.status(500).json({
                        message: 'Что-то пошло не так, попробуйте еще раз',
                    });
                }
                io.in(req.params.id).emit('messages:recived', obj);
            });
            await Room.updateOne(
                { _id: req.params.id },
                { $push: { messages: newMessage } },
            );
            return res.status(200).json({
                message: 'Файл успешно загружен',
            });
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/comment/:id', authMiddleware, (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Произошла ошибка при загрузке файла',
                });
            }
            const newComment = new Comment({
                topic: req.params.id,
                message: `/image/${req.files?.image[0].filename}`,
                user: req.user.userId,
            });
            await newComment.save();
            return res.status(200).json({
                message: 'Файл успешно загружен',
            });
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/subcomment/:id', authMiddleware, (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Произошла ошибка при загрузке файла',
                });
            }
            const { topic } = await Comment.findOne({ _id: req.params.id });
            const newComment = new Comment({
                topic,
                comment: req.params.id,
                message: `/image/${req.files?.image[0].filename}`,
                user: req.user.userId,
            });
            await newComment.save();
            await Comment.updateOne(
                { _id: req.params.id },
                { $push: { subcomments: newComment } },
            );
            return res.status(200).json({
                message: 'Файл успешно загружен',
            });
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
