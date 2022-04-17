// Ошибка деструктуризации
/* eslint-disable object-curly-newline */
import { useCallback, useContext, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { PageLinks } from 'src/components/utils/Routes/types';
import { AuthContext } from 'src/context/Authcontext';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { Layout } from '../../components/Layout';
import styles from './AuthPage.scss';
import { inputs, headers, submitTitle } from './config';

export const AuthPage = (): JSX.Element => {
    const message = useMessage();
    const location = useLocation();
    const from = location?.state?.from?.pathname;
    const { login } = useContext(AuthContext);
    const { request, loading, error, clearError } = useHttp();
    const auth = useCallback(
        async (user) => {
            try {
                const fetched = await request('/auth/signin', 'POST', user);
                if (fetched === 'OK') {
                    login(from || PageLinks.home);
                }
            } catch (e) {
                throw new SyntaxError('Что-то пошло не так');
            }
        },
        [from, login, request],
    );

    useEffect(() => {
        if (error === 'User already in system') {
            login(from || PageLinks.home);
        }
        message(error);
        clearError();
    }, [error, message, clearError, login, from]);

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
