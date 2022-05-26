import { setOpponent, Opponent } from '../reducers/opponent';
import { reduxStore as store } from '../../utils/infrastructure/store';

export const opponentService = {
    setOpponent: (opponent: Opponent | null) =>
        store.dispatch(setOpponent(opponent)),
};
