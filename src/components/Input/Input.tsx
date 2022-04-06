import { inputProps } from '../utils/ErrorBoundary/types';
import styles from './Input.scss';

export const Input = ({
    title,
    value,
    name,
    onChange,
}: inputProps): JSX.Element => (
    <div>
        <input
            className={styles.input}
            placeholder={title}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
        />
    </div>
);
