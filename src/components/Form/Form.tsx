import { Input } from '../Input';
import { formProps } from '../utils/ErrorBoundary/types';
import styles from './Form.scss';

export const Form = ({
    form,
    setForm,
    childrensUp,
    childrensDown,
}: formProps): JSX.Element => {
    const changeHandler = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };
    return (
        <div className={styles.form__main}>
            {childrensUp}
            <form className={styles.form__block}>
                {Object.keys(form).map(
                    (key: string, index: number): JSX.Element => (
                        <Input
                            key={index as any}
                            value={(form as any)[key]}
                            title={key}
                            name={key}
                            onChange={changeHandler}
                        />
                    ),
                )}
            </form>
            {childrensDown}
        </div>
    );
};
