import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useEffect, useState } from 'react';
import { Preloader } from 'src/components/Preloader';
import { AllStateTypes } from 'src/store/reducers';
import { useAuth } from 'src/hooks/auth.hook';
import { User } from 'src/store/reducers/user';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { notificationService } from 'src/store/services/notificationService';
import { Layout } from '../../components/Layout';
import plusIcon from '../../../images/plus.svg';
import searchIcon from '../../../images/search.svg';
import styles from './ChatsPage.scss';
import { Cell } from './components/cell/Cell';
import { InputMessage } from '../GamePage/components/Footer/components/InputMessage';
import { Search } from './components/Search';

export const ChatsPage = (): JSX.Element => {
    const { room } = useParams() as { room: string };
    const [videoCall, setVideoCall] = useState(false);
    const [search, setSearch] = useState(false);
    const [activeChat, setActiveChat] = useState('');
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const { token } = useAuth();
    const [rooms, setRooms] = useState([]);
    const { request, loading } = useHttp();
    const navigate = useNavigate();

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
        notificationService.addNotification({
            title: invitedUser.display_name,
            message: 'Invite sending...',
            autoDelete: false,
            user: invitedUser,
            loader: true,
        });
        createTicket(user?._id, invitedUser._id);
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
    }, [token]);

    useEffect(() => {
        if (token) {
            getRooms();
        }
        return () => setRooms([]);
    }, [token]);

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
                            <img
                                className={styles.icon}
                                src={searchIcon}
                                alt="Search"
                            />
                        </Button>
                    </div>
                    <div className={styles.chats__label}>
                        <p className={styles['chats__label-tag']}>BATTLESHIP</p>
                        <h2 className={styles['chats__label-description']}>
                            CHATS
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
                    <div className={styles['chats__main-list']}>
                        {!loading ? (
                            rooms?.map(
                                (element: User) =>
                                    user?._id !== element._id && (
                                        <Cell
                                            key={element._id}
                                            element={element}
                                            selectUser={(userData) => {
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
                                    <img
                                        className={styles.icon}
                                        src={plusIcon}
                                        alt="Invite"
                                    />
                                </Button>
                                <InputMessage
                                    {...{ videoCall, setVideoCall }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {search && (
                <Search
                    close={() => {
                        setSearch(!search);
                        getRooms();
                    }}
                />
            )}
        </Layout>
    );
};
