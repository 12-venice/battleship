/* eslint-disable @typescript-eslint/ban-types */
import { FC, MouseEventHandler, ReactElement } from 'react';

export type btnProps = {
    className?: string;
    title?: string | ReactElement;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement> | Function;
    skin?:
        | 'short'
        | 'wide'
        | 'regular'
        | 'quad'
        | 'large'
        | 'high'
        | 'auth'
        | 'small';
    color?: 'red' | 'yellow' | 'orange' | 'blue' | 'green';
    noFill?: boolean;
    href?: string;
    link?: string;
};

export type ButtonProps = FC<btnProps>;
