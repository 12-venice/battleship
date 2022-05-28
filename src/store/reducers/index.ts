/* eslint-disable import/no-default-export */
import { combineReducers } from 'redux';
import { userReducer, UserState } from './user';
import { lngReducer, LngState } from './lng';
import { opponentReducer, OpponentState } from './opponent';
import { notificationReducer, NotificationState } from './notifications';

export type AllStateTypes = {
    user: UserState;
    language: LngState;
    opponent: OpponentState;
    notification: NotificationState;
};

export default combineReducers({
    user: userReducer,
    language: lngReducer,
    opponent: opponentReducer,
    notification: notificationReducer,
});
