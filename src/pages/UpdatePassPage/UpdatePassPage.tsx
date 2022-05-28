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
import { notificationService } from 'src/store/services/notificationService';
import { Layout } from '../../components/Layout';
import styles from '../ProfilePage/ProfilePage.scss';
import { inputs } from './config';
import { Avatar } from '../ProfilePage/components/Avatar';

export const UpdatePassPage = (): JSX.Element => {
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
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
        if (error) {
            notificationService.addNotification({
                message: error,
                type: 'danger',
            });
        }
        return () => clearError();
    }, [error, clearError]);

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
                                setData={changePass}
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
