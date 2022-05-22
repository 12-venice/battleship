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
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import styles from './FinderPage.scss';

export const FinderPage = () => {
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const [online, setOnline] = useState([]);
    const navigation = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [str, setStr] = useState('');
    const { request, loading } = useHttp();
    socket.on('online', (data) => setOnline(data));

    const findUser = useCallback(async () => {
        const data = await request('/api/user/find', 'POST', { str }, {}, true);
        setRooms(data);
    }, [request, str]);

    const getRooms = useCallback(async () => {
        const data = await request(
            '/api/room/read',
            'POST',
            { _id: user?._id, rooms: user?.rooms },
            {},
            true,
        );
        setRooms(data);
    }, [request, user?._id, user?.rooms]);

    useEffect(() => {
        if (!str) {
            getRooms();
        }
        return () => setRooms([]);
    }, [getRooms, str]);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (str.length > 0) {
                findUser();
            }
        }, 1000);
        return () => clearTimeout(timeOut);
    }, [findUser, str.length]);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStr(e.target.value);
    };

    const createRoom = (invitedUserId: string) =>
        navigation(`${PageLinks.game}/1231`);
    // socket.emit('invite:send', { createdUserId: user?._id, invitedUserId });

    return (
        <Layout>
            <div className={styles.finder__background}>
                <div className={styles.finder__header}>
                    <div>
                        <Button
                            skin="quad"
                            color="orange"
                            title="✚"
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
                                        onClick={() => createRoom(element._id)}
                                    >
                                        {Avatar(element)}
                                        <span className={styles.finder__name}>
                                            {element.display_name}
                                        </span>
                                        <div
                                            className={styles.finder__point}
                                            style={{
                                                background: online.find(
                                                    (onlineUser: User) =>
                                                        onlineUser._id ===
                                                        element._id,
                                                )
                                                    ? 'greenyellow'
                                                    : 'gray',
                                            }}
                                        />
                                    </div>
                                ),
                        )
                    ) : (
                        <Preloader />
                    )}
                </div>
                <Button
                    skin="regular"
                    color="green"
                    title={dataStore.buttons.random}
                />
            </div>
        </Layout>
    );
};
