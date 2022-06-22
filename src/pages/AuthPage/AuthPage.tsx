// @ts-nocheck
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { YandexLogin } from 'src/components/utils/oauth/YandexLogin';
import { FromProps, PageLinks } from 'src/components/utils/Routes/types';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import yandexId from '../../../images/yandexid.svg';
import { Layout } from '../../components/Layout';
import styles from './AuthPage.scss';
import { inputs, headers } from './config';

export const AuthPage = (): JSX.Element => {
    const location = useLocation().state as FromProps;
    const message = useMessage();
    const { login } = useAuth();
    const from = location?.from?.pathname;
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { request, loading, error, clearError } = useHttp();

    const auth = async (userData: User) => {
        const jwtToken = await request('/api/auth/login', 'POST', userData);
        if (jwtToken) {
            login(jwtToken);
        }
    };

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    return (
        <Layout>
            <div className={styles.auth__main}>
                <span className={styles.auth__logo}>{headers.title}</span>
                <span className={styles.auth__header}>
                    {dataStore.labels.auth}
                </span>
                <Form
                    inputs={inputs}
                    setData={auth}
                    submitTitle={dataStore.buttons.login}
                    disabled={loading}
                    checking={false}
                />
                <img
                    className={styles.auth__yandexid}
                    aria-hidden
                    onClick={() => YandexLogin(from || PageLinks.home)}
                    src={yandexId}
                    alt="Yandex"
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
