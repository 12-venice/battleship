/* eslint-disable import/no-default-export */
import { Router } from 'express';
import { getUsers } from 'socketRoutes/auth.routes';
import { gameController } from 'src/server/gameController';
import { gameFieldHandler } from 'src/server/gameFieldHandler';
import { activeFieldList } from 'src/server/types';
import { reverseScore } from 'src/server/reverseScore';
import { switchQueue } from 'src/server/switchQueue';
import { reverseStatistics } from 'src/server/reverseStatistics';
import { io, ts } from '../src/server';
import User from '../serverModels/user';
import Room from '../serverModels/room';
import Game from '../serverModels/game';

const router = Router();

router.post('/accept', async (req, res) => {
    try {
        const { createdUserId, invitedUserId } = req.body;
        const createdUser = await User.findOne({ _id: createdUserId });
        const invitedUser = await User.findOne({ _id: invitedUserId });

        const isRoomCreate = await Room.findOne({
            users: [invitedUserId, createdUserId],
        });
        const isInviteRoomCreate = await Room.findOne({
            users: [createdUserId, invitedUserId],
        });

        const gameRoom = {
            id:
                isRoomCreate?._id.toString() ||
                isInviteRoomCreate?._id.toString(),
        };

        const invitedUserSocket = getUsers()?.find(
            (userSocket) => userSocket.id === invitedUserId,
        )?.socket;
        const createdUserSocket = getUsers()?.find(
            (userSocket) => userSocket.id === createdUserId,
        )?.socket;

        if (!isRoomCreate && !isInviteRoomCreate) {
            const room = new Room({ users: [createdUserId, invitedUserId] });
            await room.save();
            await User.updateOne(
                { _id: createdUserId },
                { $push: { rooms: room._id } },
            );
            await User.updateOne(
                { _id: invitedUserId },
                { $push: { rooms: room._id } },
            );
            if (invitedUserSocket && createdUserSocket) {
                invitedUserSocket.join(room._id.toString());
                createdUserSocket.join(room._id.toString());
            }
            gameRoom.id = room._id.toString();
        }
        const game = {
            room: gameRoom.id,
            createdUser,
            invitedUser,
            queue: '',
            gameOver: false,
            gameCancel: false,
            score: [0, 0],
            bonusScore: 0,
            statistics: [
                {
                    label: 'HITS',
                    [activeFieldList.invited]: 0,
                    [activeFieldList.created]: 0,
                },
                {
                    label: 'MISS',
                    [activeFieldList.invited]: 0,
                    [activeFieldList.created]: 0,
                },
                {
                    label: 'ALIVE',
                    [activeFieldList.invited]: 10,
                    [activeFieldList.created]: 10,
                },
                {
                    label: 'DESTROYED',
                    [activeFieldList.invited]: 0,
                    [activeFieldList.created]: 0,
                },
            ],
        };
        const newGame = new Game(game);
        await newGame.save();
        io.to(invitedUserSocket?.id as string).emit('game:start', {
            gameId: newGame._id,
            user: createdUser,
            room: game.room,
        });
        io.to(createdUserSocket?.id as string).emit('game:start', {
            gameId: newGame._id,
            user: invitedUser,
            room: game.room,
        });
        res.status(200).json({
            message: 'Creating a game',
        });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/invite', async (req, res) => {
    try {
        const { createdUserId, invitedUserId } = req.body;
        const createdUser = await User.findOne({ _id: createdUserId });
        const invitedUser = await User.findOne({ _id: invitedUserId });
        const invitedUserSocket = getUsers()?.find(
            (userSocket) => userSocket.id === invitedUserId,
        )?.socket;
        io.to(invitedUserSocket?.id as string).emit('game:invite', {
            from: createdUser,
            to: invitedUser,
        });
        res.status(200).json({ message: 'Invitation in processing' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/cancel', async (req, res) => {
    try {
        const { createdUserId, invitedUserId } = req.body;
        const invitedUser = await User.findOne({ _id: invitedUserId });
        const createdUserSocket = getUsers()?.find(
            (userSocket) => userSocket.id === createdUserId,
        )?.socket;
        io.to(createdUserSocket?.id as string).emit('game:cancel', {
            user: invitedUser,
        });
        res.status(200).json({ message: 'Invitation cancelled' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/ready', async (req, res) => {
    try {
        const { gameId, userId, matrix, squadron } = req.body;
        const gameStateFromDB = await Game.findOne({ _id: gameId });

        if (gameStateFromDB.createdUser._id.toString() === userId) {
            await Game.updateOne(
                { _id: gameId },
                { $set: { createdField: { matrix, squadron } } },
            );
        } else {
            await Game.updateOne(
                { _id: gameId },
                { $set: { invitedField: { matrix, squadron } } },
            );
        }
        const updGameStateFromDB = await Game.findOne({ _id: gameId });
        if (
            updGameStateFromDB.invitedField &&
            updGameStateFromDB.createdField
        ) {
            const invitedUserSocket = getUsers()?.find(
                (userSocket) =>
                    userSocket.id ===
                    updGameStateFromDB.invitedUser._id.toString(),
            )?.socket;
            const createdUserSocket = getUsers()?.find(
                (userSocket) =>
                    userSocket.id ===
                    updGameStateFromDB.createdUser._id.toString(),
            )?.socket;

            io.to(invitedUserSocket?.id as string).emit('game:step', {
                ...gameFieldHandler(
                    updGameStateFromDB.invitedField,
                    updGameStateFromDB.createdField,
                ),
                queue: updGameStateFromDB.invitedUser._id.toString(),
                gameOver: false,
                score: updGameStateFromDB.score,
                statistics: updGameStateFromDB.statistics,
            });
            io.to(createdUserSocket?.id as string).emit('game:step', {
                ...gameFieldHandler(
                    updGameStateFromDB.createdField,
                    updGameStateFromDB.invitedField,
                ),
                queue: updGameStateFromDB.invitedUser._id.toString(),
                gameOver: false,
                score: updGameStateFromDB.score,
                statistics: updGameStateFromDB.statistics,
            });
            const switchFunc = async () =>
                switchQueue({
                    createdUserID:
                        updGameStateFromDB.createdUser._id.toString(),
                    invitedUserID:
                        updGameStateFromDB.invitedUser._id.toString(),
                    createdUserSID: createdUserSocket?.id,
                    invitedUserSID: invitedUserSocket?.id,
                    gameId,
                });
            ts.updateTimer(gameId, switchFunc, 15000);
        }
        res.status(200).json({ message: 'Wait for your opponent' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/shot', async (req, res) => {
    try {
        const { gameId, userId, shot } = req.body;
        ts.deleteTimer(gameId);
        const gameStateFromDB = await Game.findOne({ _id: gameId });
        let queue;
        if (gameStateFromDB.createdUser._id.toString() === userId) {
            queue = activeFieldList.created;
        } else {
            queue = activeFieldList.invited;
        }
        const newGameState = gameController(
            gameStateFromDB.createdField,
            gameStateFromDB.invitedField,
            shot,
            queue,
            gameStateFromDB.score,
            gameStateFromDB.bonusScore,
            gameStateFromDB.statistics,
        );
        if (newGameState.queue === activeFieldList.created) {
            newGameState.queue = gameStateFromDB.createdUser._id.toString();
        } else {
            newGameState.queue = gameStateFromDB.invitedUser._id.toString();
        }
        const freshGameState = {
            ...newGameState,
            room: gameStateFromDB.room,
            createdUser: gameStateFromDB.createdUser,
            invitedUser: gameStateFromDB.invitedUser,
        };
        const invitedUserSocket = getUsers()?.find(
            (userSocket) =>
                userSocket.id === gameStateFromDB.invitedUser._id.toString(),
        )?.socket;
        const createdUserSocket = getUsers()?.find(
            (userSocket) =>
                userSocket.id === gameStateFromDB.createdUser._id.toString(),
        )?.socket;
        await Game.updateOne({ _id: gameId }, { $set: freshGameState });
        io.to(invitedUserSocket?.id as string).emit('game:step', {
            ...gameFieldHandler(
                freshGameState.invitedField,
                freshGameState.createdField,
            ),
            queue: freshGameState.queue,
            gameOver: freshGameState.gameOver,
            score: freshGameState.score,
            statistics: freshGameState.statistics,
        });
        io.to(createdUserSocket?.id as string).emit('game:step', {
            ...gameFieldHandler(
                freshGameState.createdField,
                freshGameState.invitedField,
            ),
            queue: freshGameState.queue,
            gameOver: freshGameState.gameOver,
            score: reverseScore(freshGameState.score),
            statistics: reverseStatistics(freshGameState.statistics),
        });
        const switchFunc = async () =>
            switchQueue({
                createdUserID: gameStateFromDB.createdUser._id.toString(),
                invitedUserID: gameStateFromDB.invitedUser._id.toString(),
                createdUserSID: createdUserSocket?.id,
                invitedUserSID: invitedUserSocket?.id,
                gameId,
            });
        if (!freshGameState.gameOver) {
            ts.updateTimer(gameId, switchFunc, 15000);
        } else if (gameStateFromDB.createdUser._id.toString() === userId) {
            await User.updateOne(
                { _id: gameStateFromDB.createdUser._id },
                { $inc: { wins: 1, points: freshGameState.score[1] } },
            );
            await User.updateOne(
                { _id: gameStateFromDB.invitedUser._id },
                { $inc: { defeats: 1, points: freshGameState.score[0] } },
            );
        } else {
            await User.updateOne(
                { _id: gameStateFromDB.invitedUser._id },
                { $inc: { wins: 1, points: freshGameState.score[0] } },
            );
            await User.updateOne(
                { _id: gameStateFromDB.createdUser._id },
                { $inc: { defeats: 1, points: freshGameState.score[1] } },
            );
        }
        res.status(200).json({ message: 'Coordinates accepted' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/exit', async (req, res) => {
    try {
        const { gameId, userId, gameStep } = req.body;
        ts.deleteTimer(gameId);
        const gameStateFromDB = await Game.findOne({ _id: gameId });
        const invitedUserSocket = getUsers()?.find(
            (userSocket) =>
                userSocket.id === gameStateFromDB.invitedUser._id.toString(),
        )?.socket;
        const createdUserSocket = getUsers()?.find(
            (userSocket) =>
                userSocket.id === gameStateFromDB.createdUser._id.toString(),
        )?.socket;
        if (gameStep > 0) {
            let queue;
            let score;
            if (gameStateFromDB.createdUser._id.toString() === userId) {
                queue = gameStateFromDB.invitedUser._id.toString();
                score = [
                    10 + gameStateFromDB.score[activeFieldList.invited],
                    0,
                ];
            } else {
                queue = gameStateFromDB.createdUser._id.toString();
                score = [
                    0,
                    10 + gameStateFromDB.score[activeFieldList.created],
                ];
            }
            await Game.updateOne(
                { _id: gameId },
                {
                    $set: {
                        queue,
                        score,
                        gameOver: true,
                    },
                },
            );
            io.to(invitedUserSocket?.id as string).emit('game:step', {
                ...gameFieldHandler(
                    gameStateFromDB.invitedField,
                    gameStateFromDB.createdField,
                ),
                queue,
                gameOver: true,
                score,
                statistics: gameStateFromDB.statistics,
            });
            io.to(createdUserSocket?.id as string).emit('game:step', {
                ...gameFieldHandler(
                    gameStateFromDB.createdField,
                    gameStateFromDB.invitedField,
                ),
                queue,
                gameOver: true,
                score: reverseScore(score),
                statistics: reverseStatistics(gameStateFromDB.statistics),
            });
            if (gameStateFromDB.createdUser._id.toString() === queue) {
                await User.updateOne(
                    { _id: gameStateFromDB.createdUser._id },
                    { $inc: { wins: 1, points: score[1] } },
                );
                await User.updateOne(
                    { _id: gameStateFromDB.invitedUser._id },
                    { $inc: { defeats: 1, points: score[0] } },
                );
            } else {
                await User.updateOne(
                    { _id: gameStateFromDB.invitedUser._id },
                    { $inc: { wins: 1, points: score[0] } },
                );
                await User.updateOne(
                    { _id: gameStateFromDB.createdUser._id },
                    { $inc: { defeats: 1, points: score[1] } },
                );
            }
        } else {
            await Game.updateOne(
                { _id: gameId },
                {
                    $set: {
                        gameCancel: true,
                    },
                },
            );
            io.to(invitedUserSocket?.id as string).emit('game:step', {
                gameCancel: true,
            });
            io.to(createdUserSocket?.id as string).emit('game:step', {
                gameCancel: true,
            });
        }
        res.status(200).json({ message: 'The opponent left the game' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

export default router;
