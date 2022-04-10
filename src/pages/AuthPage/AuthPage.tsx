import { NavLink } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';
import styles from './AuthPage.scss';
import { fields, headers, submit } from './config';

export const AuthPage = (): JSX.Element => {
    const setData = (data: {}) => data;

    return (
        <Layout>
            <div className={styles.auth__main}>
                <span className={styles.auth__link}>{headers.title}</span>
                <span className={styles.auth__header}>{headers.page}</span>
                <Form fields={fields} setData={setData} submit={submit} />
                <NavLink to="/register">
                    <span className={styles.auth__link}>
                        {headers.navigation}
                    </span>
                </NavLink>
            </div>
        </Layout>
    );
};
