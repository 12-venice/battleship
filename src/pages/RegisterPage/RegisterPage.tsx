import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { AllStateTypes } from 'src/store/reducers';
import { Layout } from '../../components/Layout';
import { inputs, headers } from './config';
import styles from './RegisterPage.scss';

export const RegisterPage = (): JSX.Element => {
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const message = useMessage();
    const { login } = useAuth();
    const location = useLocation();
    const from = location?.state?.from?.pathname;
    const { request, error, clearError } = useHttp();
    const createUser = useCallback(
        async (user) => {
            try {
                const fetched = await request('/auth/signup', 'POST', user);
                if (fetched.id) {
                    login(from || PageLinks.home);
                }
            } catch (e) {
                throw new Error('Что-то пошло не так');
            }
        },
        [request, login, from],
    );
    useEffect(() => {
        message(error);
        return () => clearError();
    }, [error, message, clearError]);

    return (
        <Layout>
            <div className={styles.register__main}>
                <span className={styles.register__logo}>{headers.title}</span>
                <span className={styles.register__header}>
                    {dataStore.labels.reg}
                </span>
                <Form
                    inputs={inputs}
                    setData={createUser}
                    submitTitle={dataStore.buttons.signup}
                />
                <NavLink to={PageLinks.auth}>
                    <span className={styles.register__link}>
                        {dataStore.buttons.login}
                    </span>
                </NavLink>
            </div>
        </Layout>
    );
};
