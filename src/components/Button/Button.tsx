import { ButtonProps } from '../utils/ErrorBoundary/types';

export const Button = ({ className, title }: ButtonProps): JSX.Element => (
    <button className={`button ${className}`} type="button">
        <span>{title.toUpperCase()}</span>
    </button>
);
