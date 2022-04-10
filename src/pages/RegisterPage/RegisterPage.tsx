import { NavLink } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';
import { fields, headers, submit } from './config';
import styles from './RegisterPage.scss';

export const RegisterPage = (): JSX.Element => {
    const setData = (data: {}) => data;

    return (
        <Layout>
            <div className={styles.register__main}>
                <span className={styles.register__link}>{headers.title}</span>
                <span className={styles.register__header}>{headers.page}</span>
                <Form fields={fields} setData={setData} submit={submit} />
                <NavLink to="/auth">
                    <span className={styles.register__link}>
                        {headers.navigation}
                    </span>
                </NavLink>
            </div>
        </Layout>
    );
};
