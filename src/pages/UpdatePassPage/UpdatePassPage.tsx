import { useNavigate } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { Preloader } from 'src/components/Preloader';
import { Form } from 'src/components/Form';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { lngService } from 'src/store/services/lngService';
import { useMessage } from 'src/hooks/message.hook';
import { useAuth } from 'src/hooks/auth.hook';
import { Layout } from '../../components/Layout';
import styles from '../ProfilePage/ProfilePage.scss';
import { inputs } from './config';
import { Avatar } from '../ProfilePage/components/Avatar';

export const UpdatePassPage = (): JSX.Element => {
    const message = useMessage();
    const { token } = useAuth();
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { request, loading, error, clearError } = useHttp();
    const navigate = useNavigate();
    const changePass = useCallback(
        async (data) => {
            await request('/api/user/password', 'POST', data, {
                Authorization: `Bearer ${token}`,
            });
            navigate(PageLinks.profile);
        },
        [navigate, request, token],
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
                                onClick={() => lngService.changeLng()}
                                title={dataStore.buttons.change}
                            />
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
                                setData={(data: {}) => changePass(data)}
                                submitTitle={dataStore.buttons.confirm}
                                disabled={loading}
                            />
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};
