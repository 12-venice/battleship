import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { YandexLogin } from 'src/components/oauth/YandexLogin';
import { FromProps, PageLinks } from 'src/components/utils/Routes/types';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import { notificationService } from 'src/store/services/notificationService';
import { Layout } from '../../components/Layout';
import styles from './AuthPage.scss';
import { inputs, headers } from './config';

export const AuthPage = (): JSX.Element => {
    const location = useLocation().state as FromProps;
    const navigate = useNavigate();
    const from = location?.from?.pathname;
    const user = useSelector((userState: AllStateTypes) => userState.user.item);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { login } = useAuth();
    const { request, loading, error, clearError } = useHttp();

    const auth = useCallback(
        async (userData) => {
            try {
                const fetched = await request('/auth/signin', 'POST', userData);
                if (fetched === 'OK') {
                    login(from || PageLinks.home);
                }
            } catch (e) {
                throw new Error('Что-то пошло не так');
            }
        },
        [from, login, request],
    );

    useEffect(() => {
        if (user) {
            navigate(from || PageLinks.home, { replace: true });
        }
    }, [from, navigate, user]);

    useEffect(() => {
        if (error === 'User already in system') {
            login(from || PageLinks.home);
        }
        if (error) {
            notificationService.addNotification({
                message: error,
                type: 'danger',
            });
        }
        return () => clearError();
    }, [error, clearError, login, from]);

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
                <YandexLogin currentUrl={from || PageLinks.home}>
                    <Button color="red" title="YANDEX" />
                </YandexLogin>
                <NavLink to={PageLinks.register}>
                    <span className={styles.auth__link}>
                        {headers.navigation}
                    </span>
                </NavLink>
            </div>
        </Layout>
    );
};
