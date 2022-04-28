/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable default-param-last */
/* eslint-disable indent */
import { RUSSIAN } from './RU';
import { ENGLISH } from './EN';

type SelectLng = 'ru' | 'en';

export type LngState = {
    language: SelectLng;
    translate: any;
};

const actions: Record<string, string> = {
    SELECT_RU: 'SELECT_RU',
    SELECT_EN: 'SELECT_EN',
    CHANGE_LNG: 'CHANGE_LNG',
};

interface BaseActionType<T> {
    type: T;
}

const defaultState: LngState = {
    language: 'en',
    translate: ENGLISH,
};

export function lngReducer(
    state: LngState = defaultState,
    { type }: BaseActionType<keyof typeof actions>,
): LngState {
    switch (type) {
        case actions.SELECT_RU:
            return { ...state, language: 'ru', translate: RUSSIAN };
        case actions.SELECT_EN:
            return { ...state, language: 'en', translate: ENGLISH };
        case actions.CHANGE_LNG:
            if (state.language === 'en') {
                return { ...state, language: 'ru', translate: RUSSIAN };
            }
            return { ...state, language: 'en', translate: ENGLISH };
        default:
            return state;
    }
}

export function selectRu(): BaseActionType<keyof typeof actions> {
    return { type: actions.SELECT_RU };
}
export function selectEn(): BaseActionType<keyof typeof actions> {
    return { type: actions.SELECT_EN };
}
export function changeLng(): BaseActionType<keyof typeof actions> {
    return { type: actions.CHANGE_LNG };
}
