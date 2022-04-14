import { useCallback, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { Layout } from '../../components/Layout';
import { inputs, headers, submitTitle } from './config';
import styles from './RegisterPage.scss';

export const RegisterPage = (): JSX.Element => {
    const message = useMessage();
    const { login } = useAuth();
    const { request, error, clearError } = useHttp();
    const createUser = useCallback(
        async (user) => {
            try {
                const fetched = await request('/auth/signup', 'POST', user);
                if (fetched.id) {
                    login();
                }
            } catch (e) {
                throw new SyntaxError('Что-то пошло не так');
            }
        },
        [login, request],
    );
    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    return (
        <Layout>
            <div className={styles.register__main}>
                <span className={styles.register__link}>{headers.title}</span>
                <span className={styles.register__header}>{headers.page}</span>
                <Form
                    inputs={inputs}
                    setData={createUser}
                    submitTitle={submitTitle}
                />
                <NavLink to={PageLinks.auth}>
                    <span className={styles.register__link}>
                        {headers.navigation}
                    </span>
                </NavLink>
            </div>
        </Layout>
    );
};
