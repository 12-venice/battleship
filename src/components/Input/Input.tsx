import { useEffect } from 'react';
import { notificationService } from 'src/store/services/notificationService';
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
    useEffect(() => {
        if (validateMsgFalse && className === 'validate invalid') {
            notificationService.addNotification({
                message: validateMsgFalse,
                type: 'warning',
            });
        }
    }, [className, validateMsgFalse]);

    return (
        <div className="input-field" style={{ margin: '5px 0' }}>
            <input
                style={{ width: 'min(250px, 45vw)' }}
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
        </div>
    );
};
