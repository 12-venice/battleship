/* eslint-disable import/no-default-export */
import { userReducer, UserState } from './user';
import { lngReducer, LngState } from './lng';
import { opponentReducer, OpponentState } from './opponent';

export type AllStateTypes = {
    user: UserState;
    language: LngState;
    opponent: OpponentState;
};

export default {
    user: userReducer,
    language: lngReducer,
    opponent: opponentReducer,
};
