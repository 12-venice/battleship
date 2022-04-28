import { FC, MouseEventHandler, ReactElement } from 'react';

type Props = {
    className?: string;
    title?: string | ReactElement;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    skin?: 'short' | 'wide' | 'regular' | 'quad' | 'large' | 'high' | 'auth';
    color?: 'red' | 'yellow' | 'orange' | 'blue' | 'green';
    noFill?: boolean;
    href?: string;
};

export type ButtonProps = FC<Props>;
