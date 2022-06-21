import {
    startGame,
    finishGame,
    gameCancel,
    updateGameState,
    State,
    StartGame,
} from '../reducers/game';
import { store } from '../store';

export const gameService = {
    startGame: (data: StartGame) => store.dispatch(startGame(data)),
    updateGameState: (data: State) => store.dispatch(updateGameState(data)),
    finishGame: () => store.dispatch(finishGame()),
    gameCancel: () => store.dispatch(gameCancel()),
};
