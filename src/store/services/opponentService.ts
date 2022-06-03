import { setOpponent, Opponent } from '../reducers/opponent';
import { store } from '../store';

export const opponentService = {
    setOpponent: (opponent: Opponent | null) =>
        store.dispatch(setOpponent(opponent)),
};
