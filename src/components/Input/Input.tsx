import M from 'materialize-css';
import { useEffect, useState } from 'react';
import { inputProps } from './types';
import { validationFields } from './validationFields';

export const Input = ({
    type,
    title,
    value,
    onChange,
    setValid,
}: inputProps): JSX.Element => {
    const [className, setClassName] = useState('validate');

    useEffect(() => {
        const { pattern } = validationFields[type];
        if (value) {
            if (!pattern) {
                setValid(true);
                setClassName('validate');
            }

            if (!pattern.test(value)) {
                setValid(false);
                setClassName('invalid');
            } else {
                setValid(true);
                setClassName('validate');
            }
        }
    }, [value, setValid, type]);
    M.updateTextFields();

    return (
        <div className="input-field">
            <input
                style={{ width: '250px' }}
                id={type}
                type={type === 'password' ? 'password' : 'text'}
                name={type}
                value={value}
                onChange={onChange}
                className={className}
                autoComplete="new-password"
            />
            <label style={{ color: '#eeeeee' }} htmlFor={type}>
                {title}
            </label>
            <span
                className="helper-text"
                data-error={validationFields[type].error}
                data-success="Correct"
            />
        </div>
    );
};
