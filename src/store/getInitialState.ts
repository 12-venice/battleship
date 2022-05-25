import type { State } from './types';
import { RUSSIAN as dictionaryRU } from './reducers/RU';

export const getInitialState = (pathname: string = '/'): State => {
    return {
        language: 'ru',
        dictionary: dictionaryRU,
        router: {
            location: { pathname, search: '', hash: '', key: '' },
            action: 'POP',
        },
    };
};
