// @ts-nocheck
/* eslint-disable react/jsx-curly-newline */
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Preloader } from 'src/components/Preloader';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { notificationService } from 'src/store/services/notificationService';
import { InputMessage } from 'src/components/InputMessage';
import { Icon } from 'src/components/Icon/Icon';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { Layout } from '../../components/Layout';
import styles from './ChatsPage.scss';
import { Cell } from './components/cell/Cell';
import { Search } from './components/Search';

export const ChatsPage = (): JSX.Element => {
    const { room } = useParams() as { room: string };
    const [search, setSearch] = useState(false);
    const [chatsList, setChatsList] = useState(true);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const [activeChat, setActiveChat] = useState({} as User);
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const notifications = useSelector(
        (state: AllStateTypes) => state.notification,
    );
    const { token } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const { request, loading } = useHttp();
    const navigate = useNavigate();

    const usersOnline = useSelector((state: AllStateTypes) => state.userOnline);

    const checkUserOnline = (element) => {
        const isOnline = usersOnline.filter((u) => u.id === element._id).length;
        return !!isOnline;
    };
    const checkUserGameStatus = (element) => {
        const inspectUser = usersOnline.filter((u) => u.id === element._id);
        if (inspectUser.length > 0) {
            return inspectUser[0].inGame;
        }
        return false;
    };

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
        if (checkUserOnline(invitedUser) && !checkUserGameStatus(invitedUser)) {
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
        }
    };

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

    useEffect(() => {
        if (token) {
            getRooms();
        }
        return () => setRooms([]);
    }, [getRooms, token]);

    return (
        <Layout>
            <div className={styles.chats__background}>
                <div className={styles.chats__header}>
                    <div>
                        <Button
                            skin="quad"
                            color="green"
                            disabled={!token}
                            onClick={() => setSearch(!search)}
                        >
                            <Icon type="search" />
                        </Button>
                    </div>
                    <div className={styles.chats__label}>
                        <p className={styles['chats__label-tag']}>BATTLESHIP</p>
                        <h2 className={styles['chats__label-description']}>
                            {dataStore.labels.chats}
                        </h2>
                    </div>
                    <Button
                        skin="quad"
                        color="red"
                        title="X"
                        href={PageLinks.home}
                    />
                </div>
                <div className={styles.chats__main}>
                    <Button
                        className={styles.chats__button}
                        skin="wide"
                        title="CHATS"
                        onClick={() => setChatsList(!chatsList)}
                    />
                    {chatsList && (
                        <div className={styles['chats__main-list']}>
                            {!loading ? (
                                rooms?.map(
                                    (element: User) =>
                                        user?._id !== element._id && (
                                            <Cell
                                                key={element._id.toString()}
                                                element={element}
                                                selectUser={(userData: User) => {
                                                    setActiveChat(userData);
                                                    navigate(
                                                        `${PageLinks.chats}/${userData.room}`,
                                                    );
                                                }}
                                            />
                                        ),
                                )
                            ) : (
                                <Preloader />
                            )}
                        </div>
                    )}
                    <div className={styles['chats__main-chat']}>
                        <Outlet />
                        {!room ? (
                            <div className={styles['chats__main-plug']}>
                                Select chat
                            </div>
                        ) : (
                            <div className={styles.chats__footer}>
                                <Button
                                    skin="quad"
                                    color="green"
                                    disabled={!activeChat || !token}
                                    onClick={() => {
                                        inviteUser(activeChat);
                                    }}
                                >
                                    <Icon type="plus" />
                                </Button>
                                <InputMessage />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {search && (
                <Search
                    close={() => {
                        setSearch(!search);
                        setTimeout(() => {
                            getRooms();
                        }, 1000);
                    }}
                />
            )}
        </Layout>
    );
};
