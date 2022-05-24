import { setOpponent, Opponent } from '../reducers/opponent';
import { store } from '../../index';

export const opponentService = {
    setOpponent: (opponent: Opponent | null) =>
        store.dispatch(setOpponent(opponent)),
};
