// Линтер требует указать в качестве типа строку или тернераное выражение
/* eslint-disable react/button-has-type */
import cn from 'classnames';
import styles from './Button.scss';
import { ButtonProps } from './types';

export const Button = ({
    title,
    disabled = false,
    onClick,
    type = 'button',
    skin = 'regular',
    color,
    noFill,
    className,
}: ButtonProps): JSX.Element => (
    <button
        className={cn(
            styles.button,
            skin && styles[`button_${skin}`],
            color && styles[`button-color_${color}`],
            noFill && styles['button_no-fill'],
            disabled && styles.button_disable,
            className,
        )}
        disabled={disabled}
        type={type}
        onClick={onClick}
    >
        <span>{title}</span>
    </button>
);
