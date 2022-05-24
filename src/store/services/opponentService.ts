import { setOpponent, Opponent } from '../reducers/opponent';
import { store } from '../../client';

export const opponentService = {
    setOpponent: (opponent: Opponent | null) =>
        store.dispatch(setOpponent(opponent)),
};
