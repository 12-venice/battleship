/* eslint-disable no-fallthrough */
/* eslint-disable no-param-reassign */
// Отключены для теста
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable default-param-last */
/* eslint-disable indent */

import { StringArray } from 'socketRoutes/usersOnline';

export type userOnlineState = StringArray;

const actions: Record<string, string> = {
    ADD_USER_ONLINE: 'ADD_USER_ONLINE',
    REMOVE_USER_ONLINE: 'REMOVE_USER_ONLINE',
    GET_USER_ONLINE: 'GET_USER_ONLINE',
    SET_USER_ONLINE: 'SET_USER_ONLINE',
};

interface BaseActionType<T> {
    type: T;
}
interface ItemActionType extends BaseActionType<keyof typeof actions> {
    data: { socketId?: string; _id?: string } | StringArray;
}

const defaultState: userOnlineState = {};

export function userOnlineReducer(
    state: userOnlineState = defaultState,
    { type, data }: ItemActionType,
): userOnlineState {
    switch (type) {
        case actions.ADD_USER_ONLINE: {
            console.log(state)
            if (data.socketId && data._id) {
                const newUserOnline = { [data.socketId]: data._id };
                return { ...state, ...newUserOnline };
            }
        }
        case actions.REMOVE_USER_ONLINE: {
            if (data.socketId) {
                delete state[data.socketId];
            }
            return state;
        }
        case actions.SET_USER_ONLINE: {
            return { ...state, ...data };
        }
        default:
            return state;
    }
}

export function addUserOnline(data: {
    socketId: string;
    _id: string;
}): ItemActionType {
    return { type: actions.ADD_USER_ONLINE, data };
}

export function removeUserOnline(data: { socketId: string }): ItemActionType {
    return { type: actions.REMOVE_USER_ONLINE, data };
}

export function setUserOnline(data: StringArray): ItemActionType {
    return { type: actions.SET_USER_ONLINE, data };
}
