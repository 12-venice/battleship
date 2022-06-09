/* eslint-disable no-unused-expressions */
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'src/components/Avatar';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import { Layout } from 'src/components/Layout';
import { Preloader } from 'src/components/Preloader';
import { PageLinks } from 'src/components/utils/Routes/types';
import { socket } from 'src/components/utils/Socket/Socket';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import styles from './FinderPage.scss';

export const FinderPage = () => {
    const message = useMessage();
    const { token } = useAuth();
    const navigator = useNavigate();
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const usersOnline = useSelector((state: AllStateTypes) => state.userOnline);

    const checkUserOnline = (id: string) => {
        const isOnline = Object.keys(usersOnline).find(
            (key) => usersOnline[key] === id,
        );
        return !!isOnline;
    };

    const [rooms, setRooms] = useState([]);
    const [str, setStr] = useState('');
    const { request, loading, error, clearError } = useHttp();

    const findUser = useCallback(async () => {
        const data = await request('/api/user/find', 'POST', { str });
        setRooms(data);
    }, [request, str]);
    const getRooms = useCallback(async () => {
        const data = await request(
            '/api/room/find',
            'POST',
            {
                rooms: user?.rooms,
            },
            {
                Authorization: `Bearer ${token}`,
            },
        );
        setRooms(data);
    }, [request, token, user]);

    useEffect(() => {
        getRooms();
        return () => setRooms([]);
    }, [getRooms]);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (str.length > 0) {
                findUser();
            }
        }, 1000);
        return () => clearTimeout(timeOut);
    }, [findUser, str.length]);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStr(e.target.value);
    };

    const createRoom = (invitedUserId: string) => {
        socket.emit('invite:sent', { createdUserId: user?._id, invitedUserId });
        getRooms();
    };

    const inviteUser = (invitedUserId: string, room: string) => {
        socket.emit('invite:sent', { createdUserId: user?._id, invitedUserId });
        navigator(`${PageLinks.game}/${room}`);
    };

    const selectUser = (element: User) => {
        str ? createRoom(element._id) : inviteUser(element._id, element.room);
    };

    return (
        <Layout>
            <div className={styles.finder__background}>
                <div className={styles.finder__header}>
                    <div>
                        <Button
                            skin="quad"
                            color="orange"
                            title="F"
                            onClick={() => getRooms()}
                        />
                    </div>
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
                <Input
                    type="text"
                    title={dataStore.labels.find}
                    name="text"
                    onChange={changeHandler}
                />
                <div className={styles.finder__block}>
                    {!loading ? (
                        rooms.map(
                            (element: User) =>
                                user?.id !== element.id && (
                                    <div
                                        key={element._id}
                                        aria-hidden
                                        className={styles.finder__line}
                                        onClick={() => selectUser(element)}
                                    >
                                        {Avatar(element)}
                                        <span className={styles.finder__name}>
                                            {element.display_name}
                                        </span>
                                        {!str && (
                                            <div
                                                className={styles.finder__point}
                                                style={{
                                                    background: checkUserOnline(
                                                        element._id,
                                                    )
                                                        ? 'greenyellow'
                                                        : 'gray',
                                                }}
                                            />
                                        )}
                                    </div>
                                ),
                        )
                    ) : (
                        <Preloader />
                    )}
                </div>
                {/* <Button
                    skin="regular"
                    color="green"
                    disabled
                    title={dataStore.buttons.random}
                /> */}
            </div>
        </Layout>
    );
};
