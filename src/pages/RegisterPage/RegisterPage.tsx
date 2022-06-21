import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { FromProps, PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import { Layout } from '../../components/Layout';
import { inputs, headers } from './config';
import styles from './RegisterPage.scss';

export const RegisterPage = (): JSX.Element => {
    const location = useLocation().state as FromProps;
    const from = location?.from?.pathname;
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { login } = useContext(AuthContext);
    const { request, loading } = useHttp();
    const createUser = async (user: User) => {
        const jwtToken = await request('api/user/generate', 'POST', user);
        if (jwtToken) {
            login(jwtToken, from);
        }
    };

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
