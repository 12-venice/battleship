// Отключены для теста
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable default-param-last */
/* eslint-disable indent */

type Nullable<T> = T | null;

export interface Opponent {
    id: number;
    avatar: Nullable<string>;
    first_name: string;
    second_name: string;
    display_name: Nullable<string>;
    email: string;
    login: string;
    phone: string;
    points?: number;
    wins?: number;
    defeats?: number;
}

export type OpponentState = {
    item: Nullable<Opponent>;
};

const actions: Record<string, string> = {
    SET_OPPONENT: 'SET_OPPONENT',
};

interface BaseActionType<T> {
    type: T;
}
interface ItemActionType extends BaseActionType<keyof typeof actions> {
    item: Nullable<Opponent>;
}

const defaultState: OpponentState = {
    item: null,
    // item: {display_name: 'test'},
};

export function opponentReducer(
    state: OpponentState = defaultState,
    { type, item }: ItemActionType,
): OpponentState {
    switch (type) {
        case actions.SET_OPPONENT:
            return { ...state, item };
        default:
            return state;
    }
}

export function setOpponent(opponent: Opponent | null): ItemActionType {
    return { type: actions.SET_OPPONENT, item: opponent };
}
