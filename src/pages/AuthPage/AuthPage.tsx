// Ошибка деструктуризации
/* eslint-disable object-curly-newline */
import { useCallback, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { Layout } from '../../components/Layout';
import styles from './AuthPage.scss';
import { inputs, headers, submitTitle } from './config';

export const AuthPage = (): JSX.Element => {
    const message = useMessage();
    const { login } = useAuth();
    const { request, loading, error, clearError } = useHttp();
    const auth = useCallback(
        async (user) => {
            try {
                const fetched = await request('/auth/signin', 'POST', user);
                if (fetched === 'OK') {
                    login();
                }
            } catch (e) {
                throw new SyntaxError('Что-то пошло не так');
            }
        },
        [login, request],
    );

    useEffect(() => {
        if (error === 'User already in system') {
            login();
        }
        message(error);
        clearError();
    }, [error, message, clearError, login]);

    return (
        <Layout>
            <div className={styles.auth__main}>
                <span className={styles.auth__link}>{headers.title}</span>
                <span className={styles.auth__header}>{headers.page}</span>
                <Form
                    inputs={inputs}
                    setData={auth}
                    submitTitle={submitTitle}
                    disabled={loading}
                />
                <NavLink to={PageLinks.register}>
                    <span className={styles.auth__link}>
                        {headers.navigation}
                    </span>
                </NavLink>
            </div>
        </Layout>
    );
};
