import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useEffect, useState } from 'react';
import { Preloader } from 'src/components/Preloader';
import { socket } from 'src/components/utils/Socket/Socket';
import { AllStateTypes } from 'src/store/reducers';
import { useAuth } from 'src/hooks/auth.hook';
import { User } from 'src/store/reducers/user';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { InviteLoader } from 'src/components/InviteLoader';
import { InputMessage } from 'src/components/InputMessage';
import { Icon } from 'src/components/Icon/Icon';
import { Layout } from '../../components/Layout';
import styles from './ChatsPage.scss';
import { Cell } from './components/cell/Cell';
import { Search } from './components/Search';

export const ChatsPage = (): JSX.Element => {
    const { room } = useParams() as { room: string };
    const [videoCall, setVideoCall] = useState(false);
    const [search, setSearch] = useState(false);
    const [activeChat, setActiveChat] = useState({} as User);
    const [iLoader, setILoader] = useState(false);
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const { token } = useAuth();
    const [rooms, setRooms] = useState([]);
    const { request, loading } = useHttp();
    const navigate = useNavigate();

    const inviteUser = (invitedUserId: string) => {
        setILoader(true);
        socket.emit('invite:sent', invitedUserId);
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
                                        inviteUser(activeChat._id);
                                    }}
                                >
                                    <Icon type="plus" />
                                </Button>
                                <InputMessage
                                    {...{ videoCall, setVideoCall }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {iLoader && <InviteLoader user={activeChat} />}
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
