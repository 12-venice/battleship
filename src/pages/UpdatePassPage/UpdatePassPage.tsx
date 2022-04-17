/// Ошибка деструктуризации
/* eslint-disable object-curly-newline */
import { useNavigate } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useContext, useEffect } from 'react';
import { Preloader } from 'src/components/Preloader';
import { Form } from 'src/components/Form';
import { useMessage } from 'src/hooks/message.hook';
import { AuthContext } from 'src/context/Authcontext';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Layout } from '../../components/Layout';
import styles from '../ProfilePage/ProfilePage.scss';
import { inputs, submitTitle } from './config';
import { Avatar } from '../ProfilePage/Avatar';

export const UpdatePassPage = (): JSX.Element => {
    const { user } = useContext(AuthContext);
    const message = useMessage();
    const { request, loading, error, clearError } = useHttp();
    const navigate = useNavigate();
    const changePass = useCallback(
        async (data) => {
            try {
                await request('/user/password', 'PUT', data);
                navigate(PageLinks.profile);
            } catch (e) {
                throw new SyntaxError('Что-то пошло не так');
            }
        },
        [navigate, request],
    );

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    return (
        <Layout>
            <div className={styles.profile__main}>
                {loading ? (
                    <Preloader />
                ) : (
                    <>
                        <div className={styles['profile__block-up']}>
                            <Button
                                skin="quad"
                                color="red"
                                href={PageLinks.profile}
                                title="X"
                            />
                        </div>
                        <div className={styles['profile__block-center']}>
                            {Avatar(user)}
                            <Form
                                inputs={inputs}
                                setData={changePass}
                                submitTitle={submitTitle}
                                disabled={loading}
                            />
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};
