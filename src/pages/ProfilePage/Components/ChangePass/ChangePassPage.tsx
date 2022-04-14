/// Ошибка деструктуризации
/* eslint-disable object-curly-newline */
import { useHistory } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useContext, useEffect } from 'react';
import { Preloader } from 'src/components/Preloader';
import cn from 'classnames';
import { Form } from 'src/components/Form';
import { useMessage } from 'src/hooks/message.hook';
import { AuthContext } from 'src/context/Authcontext';
import { Layout } from '../../../../components/Layout';
import styles from '../../ProfilePage.scss';
import stylesButton from '../../../../components/Button/Button.scss';
import { inputs, submitTitle } from './config';
import { Avatar } from '../../Avatar';

export const ChangePassPage = (): JSX.Element => {
    const { user } = useContext(AuthContext);
    const message = useMessage();
    const { request, loading, error, clearError } = useHttp();
    const history = useHistory();
    const changePass = useCallback(
        async (data) => {
            try {
                await request('/user/password', 'PUT', data);
                history.push('/profile');
            } catch (e) {
                throw new SyntaxError('Что-то пошло не так');
            }
        },
        [history, request],
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
                                onClick={() => {
                                    history.push('/profile');
                                }}
                                className={cn(
                                    stylesButton.red,
                                    stylesButton.slim,
                                )}
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
