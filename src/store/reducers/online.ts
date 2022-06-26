// @ts-nocheck
/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */
/* eslint-disable no-fallthrough */
/* eslint-disable indent */

export interface uOnline {
    id: string;
    inGame: boolean;
}

export type userOnlineState = uOnline[];

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
    data: uOnline[];
}

const defaultState: userOnlineState = [];

export function userOnlineReducer(
    state: userOnlineState = defaultState,
    { type, data }: ItemActionType,
): userOnlineState {
    switch (type) {
        case actions.ADD_USER_ONLINE: {
            if (data) {
                state.push(data);
                return [...state];
            }
            return state;
        }
        case actions.REMOVE_USER_ONLINE: {
            state = state.filter((user) => user.id !== (data as string));
            // const index = state.indexOf(data);
            // if (index > -1) {
            //     state.splice(index, 1);
            //     return [...state];
            // }
            return [...state];
        }
        case actions.SET_USER_ONLINE: {
            state = data;
            return [...state];
        }
        default:
            return state;
    }
}

export function addUserOnline(data: uOnline): ItemActionType {
    return { type: actions.ADD_USER_ONLINE, data };
}

export function removeUserOnline(data: string): ItemActionType {
    return { type: actions.REMOVE_USER_ONLINE, data };
}

export function setUserOnline(data: uOnline[]): ItemActionType {
    return { type: actions.SET_USER_ONLINE, data };
}
