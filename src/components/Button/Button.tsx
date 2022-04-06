import cn from 'classnames';
import { ButtonProps } from '../utils/ErrorBoundary/types';
import styles from './Button.scss';

export const Button = ({ className, title }: ButtonProps): JSX.Element => (
    <button className={cn(styles.button, className)} type="button">
        <span>{title.toUpperCase()}</span>
    </button>
);
