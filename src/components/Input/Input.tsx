import M from 'materialize-css';
import { inputProps } from './types';

export const Input = ({
    type = 'text',
    title = '',
    defaultValue,
    name,
    onChange,
    className = 'validate',
    validateMsgTrue = '',
    validateMsgFalse = '',
}: inputProps): JSX.Element => {
    M.updateTextFields();

    return (
        <div className="input-field">
            <input
                style={{ width: '250px' }}
                id={name}
                type={type}
                name={name}
                onChange={onChange}
                defaultValue={defaultValue}
                className={className}
                autoComplete="new-password"
            />
            <label className={defaultValue ? 'active' : ''} htmlFor={name}>
                {title}
            </label>
            {validateMsgFalse || validateMsgTrue ? (
                <span
                    className="helper-text"
                    data-error={validateMsgFalse}
                    data-success={validateMsgTrue}
                />
            ) : null}
        </div>
    );
};
