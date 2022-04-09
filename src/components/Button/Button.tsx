// Линтер требует указать в качестве типа строку или тернераное выражение
/* eslint-disable react/button-has-type */

import { ButtonProps } from './types';

export const Button = ({
    className,
    title,
    disabled = false,
    onClick,
    type = 'button',
}: ButtonProps): JSX.Element => (
    <button
        className={`button ${className}`}
        disabled={disabled}
        type={type}
        onClick={onClick}
    >
        <span>{title}</span>
    </button>
);
