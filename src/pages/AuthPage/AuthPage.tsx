// @ts-nocheck
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { YandexLogin } from 'src/components/utils/oauth/YandexLogin';
import { FromProps, PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import yandexId from '../../../images/yandexid.svg';
import { Layout } from '../../components/Layout';
import styles from './AuthPage.scss';
import { inputs, headers } from './config';

export const AuthPage = (): JSX.Element => {
    const location = useLocation().state as FromProps;
    const from = location?.from?.pathname;
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { request, loading } = useHttp();
    const { login } = useContext(AuthContext);
    const auth = async (userData: User) => {
        const jwtToken = await request('/api/auth/login', 'POST', userData);
        if (jwtToken) {
            login(jwtToken, from);
        }
    };

    return (
        <Layout>
            <div className={styles.auth__main}>
                <span className={styles.auth__logo}>{headers.title}</span>
                <span className={styles.auth__header}>
                    {dataStore.labels.auth}
                </span>
                <Form
                    styleClass={styles.auth__form}
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
                        {dataStore.buttons.signup}
                    </span>
                </NavLink>
            </div>
        </Layout>
    );
};
