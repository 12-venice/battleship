import { useCallback, useContext, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { PageLinks } from 'src/components/utils/Routes/types';
import { AuthContext } from 'src/context/Authcontext';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { Layout } from '../../components/Layout';
import { inputs, headers, submitTitle } from './config';
import styles from './RegisterPage.scss';

export const RegisterPage = (): JSX.Element => {
    const message = useMessage();
    const { login } = useContext(AuthContext);
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
        clearError();
    }, [error, message, clearError]);

    return (
        <Layout>
            <div className={styles.register__main}>
                <span className={styles.register__logo}>{headers.title}</span>
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
