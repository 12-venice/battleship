/* eslint-disable import/no-default-export */
import { combineReducers } from 'redux';
import { userReducer } from './user';
import { countReducer } from './counter';

export default combineReducers({
    user: userReducer,
    count: countReducer,
});
