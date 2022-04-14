// Линтер требует указать в качестве типа строку или тернераное выражение
/* eslint-disable react/button-has-type */
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
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
    href,
}: ButtonProps): JSX.Element => {
    const history = useHistory();
    let handlerClick;
    if (href) {
        handlerClick = () => history.push(href);
    }
    if (onClick) {
        handlerClick = onClick;
    }

    return (
        <button
            className={cn(
                styles.button,
                skin && styles[`button_${skin}`],
                color && styles[`button-color_${color}`],
                noFill && styles['button_no-fill'],
                disabled && styles.button_disable,
            )}
            disabled={disabled}
            type={type}
            onClick={handlerClick}
        >
            <span>{title}</span>
        </button>
    );
};
