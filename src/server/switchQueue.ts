import { io } from 'src/server';
import { gameFieldHandler } from './gameFieldHandler';
import { reverseScore } from './reverseScore';
import { reverseStatistics } from './reverseStatistics';
import Game from '../../serverModels/game';

export async function switchQueue({
    createdUserSID,
    invitedUserSID,
    gameId,
    createdUserID,
    invitedUserID,
}) {
    let newQueue;
    const gameStateFromDB = await Game.findOne({ _id: gameId });
    if (gameStateFromDB.queue === createdUserID) {
        newQueue = invitedUserID;
    } else {
        newQueue = createdUserID;
    }
    io.to(invitedUserSID as string).emit('game:step', {
        ...gameFieldHandler(
            gameStateFromDB.invitedField,
            gameStateFromDB.createdField,
        ),
        queue: newQueue,
        gameOver: gameStateFromDB.gameOver,
        score: gameStateFromDB.score,
        statistics: gameStateFromDB.statistics,
    });
    io.to(createdUserSID as string).emit('game:step', {
        ...gameFieldHandler(
            gameStateFromDB.createdField,
            gameStateFromDB.invitedField,
        ),
        queue: newQueue,
        gameOver: gameStateFromDB.gameOver,
        score: reverseScore(gameStateFromDB.score),
        statistics: reverseStatistics(gameStateFromDB.statistics),
    });
    await Game.updateOne({ _id: gameId }, { $set: { queue: newQueue } });
}
