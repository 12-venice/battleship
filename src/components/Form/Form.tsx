import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import styles from './Form.scss';
import { formProps } from './types';
import { validation } from '../utils/Validation/validation';

export const Form = ({
    inputs,
    setData,
    submitTitle,
    disabled,
    checking = true,
}: formProps): JSX.Element => {
    const [fields, setFields] = useState(inputs);
    let formValues = fields.reduce(
        (obj, item) => ({
            ...obj,
            ...{ [item.name]: item.defaultValue ? item.defaultValue : '' },
        }),
        {},
    );

    const changeHandler = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        formValues = {
            ...formValues,
            ...{ [event.target.name]: event.target.value },
        };
    };

    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!checking) {
            setData(formValues);
        } else {
            const { valid, newFields } = validation(fields, formValues);
            if (valid) {
                setData(formValues);
            }
            setFields(newFields);
        }
    };

    return (
        <form className={styles.form__main} onSubmit={handleSubmit}>
            <div className={styles.form__block}>
                {fields.map(
                    (field): JSX.Element => (
                        <Input
                            defaultValue={field.defaultValue}
                            className={field.className}
                            validateMsgFalse={field.validateMsgFalse}
                            key={uuidv4()}
                            type={field.type}
                            title={field.title}
                            name={field.name}
                            onChange={changeHandler}
                        />
                    ),
                )}
            </div>
            <Button
                disabled={disabled}
                type="submit"
                title={submitTitle}
                skin="wide"
            />
        </form>
    );
};
