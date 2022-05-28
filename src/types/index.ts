import { ReactNode } from 'react';

export type WithChildren<T = {}> = T & { children?: ReactNode };

export interface State {
    main: {
        name: string;
    };
}
