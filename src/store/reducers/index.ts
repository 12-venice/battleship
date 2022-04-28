/* eslint-disable import/no-default-export */
import { combineReducers } from 'redux';
import { userReducer, UserState } from './user';

export type AllStateTypes = { user: UserState };

export default combineReducers({
    user: userReducer,
});
