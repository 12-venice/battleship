/* eslint-disable import/no-default-export */
import { combineReducers } from 'redux';
import { userReducer, UserState } from './user';
import { lngReducer, LngState } from './lng';
import { opponentReducer, OpponentState } from './opponent';
import { notificationReducer, NotificationState } from './notifications';
import { userOnlineReducer, userOnlineState } from './online';
import { gameReducer, Game } from './game';
import { MSGReducer, TypeMSGState } from './message';
import { videoCall, videoCallReducer } from './videocall';

export type AllStateTypes = {
    user: UserState;
    language: LngState;
    opponent: OpponentState;
    notification: NotificationState;
    userOnline: userOnlineState;
    game: Game;
    message: TypeMSGState;
    videocall: videoCall;
};

export default combineReducers({
    user: userReducer,
    language: lngReducer,
    opponent: opponentReducer,
    notification: notificationReducer,
    userOnline: userOnlineReducer,
    game: gameReducer,
    message: MSGReducer,
    videocall: videoCallReducer,
});
