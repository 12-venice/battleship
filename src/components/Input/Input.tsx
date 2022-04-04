import { inputProps } from '../utils/ErrorBoundary/types';

export const Input = ({ className, title }: inputProps): JSX.Element => (
    <input className={`input ${className}`} placeholder={title} />
);
