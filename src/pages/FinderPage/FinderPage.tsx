// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-expressions */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
// import { Input } from 'src/components/Input';
import { Layout } from 'src/components/Layout';
import { Preloader } from 'src/components/Preloader';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Icon } from 'src/components/Icon/Icon';
// import { socket } from 'src/components/utils/Socket/Socket';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import { notificationService } from 'src/store/services/notificationService';
import { Cell } from './components/cell/Cell';
import styles from './FinderPage.scss';

export const FinderPage = () => {
    const message = useMessage();
    const { token } = useContext(AuthContext);
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const usersOnline = useSelector((state: AllStateTypes) => state.userOnline);
    const notifications = useSelector(
        (state: AllStateTypes) => state.notification,
    );
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const [rooms, setRooms] = useState([]);
    const [flag, setFlag] = useState(false);
    const { request, loading, error, clearError } = useHttp();

    const getRooms = useCallback(async () => {
        const data = await request(
            '/api/room/find',
            'POST',
            {},
            {
                Authorization: `Bearer ${token}`,
            },
        );
        setRooms(data);
    }, [request, token]);

    const getOnlineUsers = useCallback(async () => {
        const data = await request('/api/user/online', 'GET', null, {
            Authorization: `Bearer ${token}`,
        });
        setRooms(data);
    }, [request, token]);

    useEffect(() => {
        if (token) {
            getOnlineUsers();
        }
        return () => setRooms([]);
    }, [getRooms, token]);

    const createTicket = useCallback(
        async (createdUserId, invitedUserId) => {
            const data = {
                createdUserId,
                invitedUserId,
            };
            await request('/api/game/invite', 'POST', data, {
                Authorization: `Bearer ${token}`,
            });
        },
        [request, token],
    );

    const inviteUser = (invitedUser: any) => {
        const index = notifications.filter(
            (toast) => toast.message === 'Invite sending...',
        );
        if (index.length > 0) return;
        notificationService.addNotification({
            title: invitedUser.display_name,
            message: 'Invite sending...',
            autoDelete: false,
            user: invitedUser,
            loader: true,
        });
        createTicket(user?._id, invitedUser._id);
    };

    useEffect(() => {
        message(error);
        return () => clearError();
    }, [error, message, clearError]);

    const sendRandomInvite = () => {
        const online = rooms.filter(
            (element: User) => user?._id !== element._id,
        );
        const freeGameStatus = online.filter(
            (user) =>
                !usersOnline.filter((user2) => user._id === user2.id)[0].inGame,
        );
        if (freeGameStatus.length > 0) {
            inviteUser(online[Math.floor(Math.random() * online.length)]);
        }
    };

    return (
        <Layout>
            <div className={styles.finder__background}>
                <div className={styles.finder__header}>
                    <Button
                        skin="quad"
                        color="orange"
                        onClick={() => {
                            flag ? getOnlineUsers() : getRooms();
                            setFlag(!flag);
                        }}
                    >
                        <Icon type="invite" />
                    </Button>
                    <div className={styles.finder__label}>
                        <p className={styles['finder__label-tag']}>
                            BATTLESHIP
                        </p>
                        <h2 className={styles['finder__label-description']}>
                            {dataStore.labels.finder}
                        </h2>
                    </div>
                    <Button
                        skin="quad"
                        color="red"
                        title="X"
                        href={PageLinks.home}
                    />
                </div>
                <div className={styles.finder__block}>
                    {!loading ? (
                        rooms?.map(
                            (element: User) =>
                                user?._id !== element._id && (
                                    <Cell
                                        key={element._id.toString()}
                                        element={element}
                                    />
                                ),
                        )
                    ) : (
                        <Preloader />
                    )}
                </div>
                <div className={styles.finder__buttons}>
                    <Button
                        skin="regular"
                        title={dataStore.buttons.update}
                        onClick={() => {
                            flag ? getRooms() : getOnlineUsers();
                        }}
                    />
                    <Button
                        skin="regular"
                        color="green"
                        title={dataStore.buttons.random}
                        onClick={() => sendRandomInvite()}
                    />
                </div>
            </div>
        </Layout>
    );
};
