import { ButtonProps } from '../utils/ErrorBoundary/types';

export const Button = ({
    className,
    title,
    disabled = false,
    onClick,
    type,
}: ButtonProps): JSX.Element => (
    <button
        className={`button ${className}`}
        disabled={disabled}
        // eslint-disable-next-line react/button-has-type
        type={type || 'button'}
        onClick={onClick}
    >
        <span>{title.toUpperCase()}</span>
    </button>
);
