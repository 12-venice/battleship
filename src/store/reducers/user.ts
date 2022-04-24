/* eslint-disable default-param-last */
/* eslint-disable indent */
type LoadStatus = 'success' | 'pending' | 'failed' | 'error';

type Nullable<T> = T | null;

export interface User {
    id: number;
    avatar: Nullable<string>;
    first_name: string;
    second_name: string;
    display_name: Nullable<string>;
    email: string;
    login: string;
    phone: string;
}

export type UserState = {
    item: Nullable<User>;
    status: LoadStatus;
};

const actions: Record<string, string> = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    SET_USER_ITEM: 'SET_USER_ITEM',
};

interface BaseActionType<T> {
    type: T;
}
interface ItemActionType extends BaseActionType<keyof typeof actions> {
    item: Nullable<User>;
}

const defaultState: UserState = {
    status: 'error',
    item: null,
};

export function userReducer(
    state: UserState = defaultState,
    { type, item }: ItemActionType,
): UserState {
    switch (type) {
        case actions.PENDING:
            return { ...state, status: 'pending' };
        case actions.SUCCESS:
            return { ...state, status: 'success' };
        case actions.FAILED:
            return { ...state, status: 'failed' };
        case actions.SET_USER_ITEM:
            return { ...state, item };
        default:
            return state;
    }
}

export function loadSuccess(): ItemActionType {
    return { type: actions.SUCCESS, item: null };
}
export function loadFailed(): ItemActionType {
    return { type: actions.FAILED, item: null };
}
export function loadPending(): ItemActionType {
    return { type: actions.PENDING, item: null };
}

export function setUser(user: User | null): ItemActionType {
    return { type: actions.SET_USER_ITEM, item: user };
}
