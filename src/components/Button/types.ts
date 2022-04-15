import { MouseEventHandler } from 'react';

export type ButtonProps = {
    className?: string;
    title: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    skin?: 'short' | 'wide' | 'regular' | 'quad' | 'large' | 'high' | 'auth';
    color?: 'red' | 'yellow' | 'orange' | 'blue' | 'green';
    noFill?: boolean;
    href?: string;
};
