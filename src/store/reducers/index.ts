/* eslint-disable import/no-default-export */
import { userReducer, UserState } from './user';
import { lngReducer, LngState } from './lng';

export type AllStateTypes = { user: UserState; language: LngState };

export default {
    user: userReducer,
    language: lngReducer,
};
