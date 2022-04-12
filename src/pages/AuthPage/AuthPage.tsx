import { NavLink } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';
import styles from './AuthPage.scss';
import { inputs, headers, submitTitle } from './config';

export const AuthPage = (): JSX.Element => {
    const setData = (data: {}) => data;

    return (
        <Layout>
            <div className={styles.auth__main}>
                <span className={styles.auth__link}>{headers.title}</span>
                <span className={styles.auth__header}>{headers.page}</span>
                <Form
                    inputs={inputs}
                    setData={setData}
                    submitTitle={submitTitle}
                />
                <NavLink to="/register">
                    <span className={styles.auth__link}>
                        {headers.navigation}
                    </span>
                </NavLink>
            </div>
        </Layout>
    );
};
