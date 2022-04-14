import { NavLink } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';
import { inputs, headers, submitTitle } from './config';
import styles from './RegisterPage.scss';

export const RegisterPage = (): JSX.Element => {
    const setData = (data: {}) => data;

    return (
        <Layout>
            <div className={styles.register__main}>
                <span className={styles.register__link}>{headers.title}</span>
                <span className={styles.register__header}>{headers.page}</span>
                <Form
                    inputs={inputs}
                    setData={setData}
                    submitTitle={submitTitle}
                />
                <NavLink to="/auth">
                    <span className={styles.register__link}>
                        {headers.navigation}
                    </span>
                </NavLink>
            </div>
        </Layout>
    );
};
