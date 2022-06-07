import { ReactElement } from 'react';

/* eslint-disable @typescript-eslint/ban-types */
export type PROPS = {
    onSuccess: Function;
    currentUrl: string;
    children: ReactElement;
};
