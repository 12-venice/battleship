import type { State } from './types';
import { RUSSIAN as dictionaryRU } from './reducers/RU';

export const getInitialState = (pathname: string = '/'): State => {
    return {
        language: {
            language: 'ru',
            translate: dictionaryRU,
        },
        router: {
            location: { pathname, search: '', hash: '', key: '' },
            action: 'POP',
        },
    };
};
