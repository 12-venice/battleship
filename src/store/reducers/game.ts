// Отключены для теста
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable default-param-last */
/* eslint-disable indent */

type Nullable<T> = T | null;

export interface Statistic {
    label: string;
    [0]: number;
    [1]: number;
}

export interface Ship {
    decCount: number;
    id: string;
    isHorizontal: boolean;
    isRip: boolean;
    x: number;
    y: number;
}

export interface Field {
    matrix: Array<Array<number>>;
    ships: Array<Ship>;
}

export interface State {
    playerField: Field;
    opponentField: Field;
    statistics: Array<Statistic>;
    score: Array<number>;
    queue: string;
    finish: boolean;
}

export interface Game {
    room: Nullable<string>;
    id: Nullable<string>;
    state: Nullable<State>;
    gameCancel: boolean;
}

export interface StartGame {
    room: string;
    id: string;
}

const actions: Record<string, string> = {
    START_GAME: 'START_GAME',
    UPDATE_GAME_STATE: 'UPDATE_GAME_STATE',
    FINISH_GAME: 'FINISH_GAME',
    CANCEL_GAME: 'CANCEL_GAME',
};

interface BaseActionType<T> {
    type: T;
}
interface ItemActionType extends BaseActionType<keyof typeof actions> {
    data: State | string | StartGame;
}

const defaultState: Game = {
    room: null,
    state: null,
    id: null,
    gameCancel: false,
};

export function gameReducer(
    state: Game = defaultState,
    { type, data }: ItemActionType,
): Game {
    switch (type) {
        case actions.START_GAME: {
            return { ...state, room: data.room, id: data.id };
        }
        case actions.UPDATE_GAME_STATE: {
            return { ...state, state: data as State };
        }
        case actions.FINISH_GAME: {
            return defaultState;
        }
        case actions.CANCEL_GAME: {
            return { ...state, gameCancel: true };
        }
        default:
            return state;
    }
}

export function startGame(data: StartGame): ItemActionType {
    return { type: actions.START_GAME, data };
}

export function updateGameState(data: State): ItemActionType {
    return { type: actions.UPDATE_GAME_STATE, data };
}

export function finishGame(data = ''): ItemActionType {
    return { type: actions.FINISH_GAME, data };
}

export function gameCancel(data = ''): ItemActionType {
    return { type: actions.CANCEL_GAME, data };
}
