// @ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import { ModalWindow } from 'src/components/ModalWindow';
import { Preloader } from 'src/components/Preloader';
import { socket } from 'src/components/utils/Socket/Socket';
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import { Cell } from '../cell/Cell';

import styles from './Search.scss';

import { Props } from './types';

export const Search: Props = ({ close }): JSX.Element => {
    const { request, loading, error, clearError } = useHttp();
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const [rooms, setRooms] = useState([]);
    const [str, setStr] = useState('');
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStr(e.target.value);
    };
    const createRoom = (invitedUserId: string) => {
        socket.emit('invite:sent', invitedUserId);
        close();
    };
    const findUser = useCallback(async () => {
        const data = await request('/api/user/find', 'POST', { str });
        setRooms(data);
    }, [request, str]);
    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (str) {
                findUser();
            }
        }, 1000);
        return () => clearTimeout(timeOut);
    }, [findUser, str]);
    return (
        <ModalWindow>
            <Input
                type="text"
                title="FIND"
                name="text"
                onChange={changeHandler}
            />
            <div className={styles.search__block}>
                {!loading ? (
                    rooms?.map(
                        (element: User) =>
                            user?._id !== element._id && (
                                <Cell
                                    element={element}
                                    selectUser={() => createRoom(element._id)}
                                />
                            ),
                    )
                ) : (
                    <Preloader />
                )}
            </div>
            <Button skin="high" title="BACK" color="green" onClick={close} />
        </ModalWindow>
    );
};
