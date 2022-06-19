/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-expressions */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import { Layout } from 'src/components/Layout';
import { Preloader } from 'src/components/Preloader';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { PageLinks } from 'src/components/utils/Routes/types';
import { socket } from 'src/components/utils/Socket/Socket';
import { useHttp } from 'src/hooks/http.hook';
import { useMessage } from 'src/hooks/message.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import { Cell } from './components/cell/Cell';
import styles from './FinderPage.scss';

export const FinderPage = () => {
    const message = useMessage();
    const { token } = useContext(AuthContext);
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );

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
            {},
            {
                Authorization: `Bearer ${token}`,
            },
        );
        setRooms(data);
    }, [request, token]);

    useEffect(() => {
        if (!str && token) {
            getRooms();
        }
        return () => setRooms([]);
    }, [getRooms, str, token]);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (str) {
                findUser();
            }
        }, 1000);
        return () => clearTimeout(timeOut);
    }, [findUser, str]);

    useEffect(() => {
        message(error);
        return () => clearError();
    }, [error, message, clearError]);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStr(e.target.value);
    };

    const sendRandomInvite = () => {
        socket.emit('invite:random');
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
                        rooms?.map(
                            (element: User) =>
                                user?._id !== element._id && (
                                    <Cell
                                        key={element._id.toString()}
                                        element={element}
                                        str={str}
                                    />
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
                    onClick={() => sendRandomInvite()}
                />
            </div>
        </Layout>
    );
};
