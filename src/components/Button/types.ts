import { MouseEventHandler } from 'react';

export type ButtonProps = {
    className?: string;
    title: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement>;
};
