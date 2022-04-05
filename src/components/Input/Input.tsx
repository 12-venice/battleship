import { inputProps } from '../utils/ErrorBoundary/types';

export const Input = ({
    title,
    value,
    name,
    onChange,
}: inputProps): JSX.Element => (
    <div className="input-field">
        <input
            className="input"
            placeholder={title}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
        />
    </div>
);
