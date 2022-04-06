import { useState } from 'react';
import { Input } from '../Input';
import { formProps } from '../utils/ErrorBoundary/types';

export const Form = ({ fields, setData, submit }: formProps): JSX.Element => {
    const [valid, setValid] = useState(false);
    const [form, setForm] = useState(
        fields.reduce(
            (obj, item) => Object.assign(obj, { [item.type]: '' }),
            {},
        ),
    );
    const changeHandler = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };
    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (valid) {
            setData(form);
        }
    };

    return (
        <form className="form__main" onSubmit={handleSubmit}>
            <div className="form__block">
                {fields.map(
                    (
                        field: { type: string; title: string },
                        index: number,
                    ): JSX.Element => (
                        <Input
                            setValid={setValid}
                            key={index as any}
                            type={field.type}
                            value={(form as any)[field.type]}
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
