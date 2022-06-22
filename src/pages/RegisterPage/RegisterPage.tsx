// @ts-nocheck
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import { Layout } from '../../components/Layout';
import { inputs, headers } from './config';
import styles from './RegisterPage.scss';

export const RegisterPage = (): JSX.Element => {
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { login } = useAuth();
    const message = useMessage();
    const { request, error, clearError, loading } = useHttp();
    const createUser = async (user: User) => {
        const token = await request('api/user/generate', 'POST', user);
        if (token) {
            login(token);
        }
    };

    useEffect(() => {
        message(error);
        clearError();
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
                    setData={(data: User) => createUser(data)}
                    submitTitle={dataStore.buttons.signup}
                    disabled={loading}
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
