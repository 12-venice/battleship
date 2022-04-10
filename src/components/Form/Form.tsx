import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../Input';
import styles from './Form.scss';
import { formProps } from './types';

export const Form = ({ fields, setData, submit }: formProps): JSX.Element => {
    const [valid, setValid] = useState(false);
    const [formFields, setFormFields] = useState(
        fields.reduce((obj, item) => ({ ...obj, ...{ [item.type]: '' } }), {}),
    );
    const changeHandler = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setFormFields({
            ...formFields,
            [event.target.name]: event.target.value,
        });
    };
    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (valid) {
            setData(formFields);
        }
    };

    return (
        <form className={styles.form__main} onSubmit={handleSubmit}>
            <div className={styles.form__block}>
                {fields.map(
                    (field): JSX.Element => (
                        <Input
                            setValid={setValid}
                            key={uuidv4()}
                            type={field.type}
                            value={
                                formFields[
                                    field.type as keyof typeof formFields
                                ]
                            }
                            title={field.title}
                            onChange={changeHandler}
                        />
                    ),
                )}
            </div>
            {submit}
        </form>
    );
};
