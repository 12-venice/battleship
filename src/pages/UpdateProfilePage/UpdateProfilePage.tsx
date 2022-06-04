import { useNavigate } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useEffect, useState } from 'react';
import { Preloader } from 'src/components/Preloader';
import { Form } from 'src/components/Form';
import { fieldsProps } from 'src/components/Form/types';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Layout } from 'src/components/Layout';
import { userService } from 'src/store/services/userService';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { lngService } from 'src/store/services/lngService';
import { notificationService } from 'src/store/services/notificationService';
import styles from '../ProfilePage/ProfilePage.scss';
import { inputs } from './config';
import { Avatar } from '../ProfilePage/components/Avatar';
import { UpdateAvatar } from './components/UpdateAvatar';

export const UpdateProfilePage = (): JSX.Element => {
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const inputsWithDefaultsValue: fieldsProps[] = [];
    inputs.forEach((input) => {
        const element = {
            ...input,
            ...{ defaultValue: user?.[input.name as keyof typeof user] || '' },
        };
        inputsWithDefaultsValue.push(element);
    });
    const { request, loading, error, clearError } = useHttp();
    const navigate = useNavigate();
    const [updateAvatar, setUpdateAvatar] = useState(false);
    const getUpdateAvatar = () => setUpdateAvatar(!updateAvatar);
    const changeProfile = useCallback(
        async (data) => {
            try {
                const fetched = await request('/user/profile', 'PUT', data);
                await request('/api/user/update', 'POST', fetched, {}, true);
                userService.setUser(fetched);
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
                            {Avatar(user, getUpdateAvatar)}
                            <Form
                                inputs={inputsWithDefaultsValue}
                                setData={changeProfile}
                                submitTitle={dataStore.buttons.confirm}
                                disabled={loading}
                            />
                        </div>
                    </>
                )}
            </div>
            {updateAvatar && <UpdateAvatar close={getUpdateAvatar} />}
        </Layout>
    );
};
