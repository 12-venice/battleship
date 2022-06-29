import { useEffect } from 'react';
import { useMessage } from 'src/hooks/message.hook';
import { inputProps } from './types';

export const Input = ({
    type = 'text',
    title = '',
    defaultValue,
    name,
    onChange,
    className = 'validate',
    validateMsgFalse,
}: inputProps): JSX.Element => {
    const message = useMessage();

    useEffect(() => {
        if (validateMsgFalse && className === 'validate invalid') {
            message(validateMsgFalse, 'warning');
        }
    }, [validateMsgFalse, message, className]);

    return (
        <div style={{ margin: '5px 0' }}>
            <input
                style={{ width: 'min(250px, 57vw)' }}
                id={name}
                type={type}
                name={name}
                onChange={onChange}
                defaultValue={defaultValue}
                className={className}
                placeholder={title}
                autoComplete="new-password"
            />
        </div>
    );
};
