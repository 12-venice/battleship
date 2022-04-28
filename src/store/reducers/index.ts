/* eslint-disable import/no-default-export */
import { combineReducers } from 'redux';
import { userReducer, UserState } from './user';
import { lngReducer, LngState } from './lng';

export type AllStateTypes = { user: UserState; language: LngState };

export default combineReducers({
    user: userReducer,
    language: lngReducer,
});
