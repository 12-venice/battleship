/* eslint-disable indent */
type LoadStatus = 'success' | 'pending' | 'failed' | 'error';

type Nullable<T> = T | null;

interface User {
    name: string;
    birthday: number;
}

interface BaseActionType<T> {
    type: T;
}

type UserState = {
    item: Nullable<User>;
    status: LoadStatus;
};

const actions = {
    SET_STATUS: 'SET_STATUS',
};

interface ItemActionType extends BaseActionType<keyof actions> {
    status: LoadStatus;
}

const defaultState: UserState = {
    status: 'error',
    item: null,
};

export function userReducer(
    state: UserState = defaultState,
    { type, status }: ItemActionType = {},
): UserState {
    switch (type) {
        case actions.SET_STATUS:
            return { ...state, status };
        default:
            return state;
    }
}

export function setLoadingStatus(status: LoadStatus) {
    return { type: actions.SET_STATUS, status };
}
