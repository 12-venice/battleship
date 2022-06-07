import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './Button.scss';
import { ButtonProps } from './types';

export const Button: ButtonProps = ({
    title,
    disabled = false,
    onClick,
    type = 'button',
    skin = 'regular',
    color,
    noFill,
    href,
    className,
    children,
    link,
}) => {
    const navigate = useNavigate();
    let handlerClick;
    if (href) {
        handlerClick = () => navigate(href);
    }
    if (onClick) {
        handlerClick = onClick;
    }

    return (
        <button
            href={link}
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
            onClick={handlerClick}
        >
            <span>
                {title}
                {children}
            </span>
        </button>
    );
};
