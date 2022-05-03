import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from 'src/components/Avatar';
import { Button } from 'src/components/Button';
import { Layout } from 'src/components/Layout';
import { PageLinks } from 'src/components/utils/Routes/types';
import { socket } from 'src/components/utils/Socket/Socket';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import styles from './FinderPage.scss';

export const FinderPage = () => {
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const [users, setUsers] = useState([]);
    socket.on('online', (data) => setUsers(data));
    const sendInvite = (id: number) => socket.emit('invite:send', id);

    return (
        <Layout>
            <div className={styles.finder__main}>
                <div className={styles.finder__close}>
                    <Button
                        href={PageLinks.home}
                        skin="quad"
                        color="red"
                        title="X"
                    />
                </div>
                <div className={styles.finder__block}>
                    <span className={styles.finder__header}>ONLINE</span>
                    {users.length > 1 ? (
                        users.map(
                            (element: User) =>
                                user?.id !== element.id && (
                                    <div
                                        aria-hidden
                                        className={styles.finder__line}
                                        onClick={() => sendInvite(element.id)}
                                    >
                                        {Avatar(element)}
                                        {element.display_name}
                                    </div>
                                ),
                        )
                    ) : (
                        <span>No online users</span>
                    )}
                </div>
            </div>
        </Layout>
    );
};
