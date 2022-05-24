import type { RouterState } from 'connected-react-router';
import type { State } from './types';

export const getInitialState = (pathname: string = '/'): State => {
    return {
        router: {
            location: { pathname, search: '', hash: '', key: '' },
            action: 'POP',
        } as unknown as RouterState,
    };
};
