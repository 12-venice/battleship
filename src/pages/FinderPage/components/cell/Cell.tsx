// @ts-nocheck
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/destructuring-assignment */
import { Avatar } from 'src/components/Avatar';
import { useHttp } from 'src/hooks/http.hook';
import { User } from 'src/store/reducers/user';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { messageService } from 'src/store/services/messageService';
import { useCallback, useContext } from 'react';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { notificationService } from 'src/store/services/notificationService';
import styles from './Cell.scss';

export const Cell = ({ element }: { element: User }) => {
    const { request } = useHttp();
    const { token } = useContext(AuthContext);
    const usersOnline = useSelector((state: AllStateTypes) => state.userOnline);
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const notifications = useSelector(
        (state: AllStateTypes) => state.notification,
    );

    const checkUserOnline = () => {
        const isOnline = usersOnline.find((u) => u.id === element._id);
        if (!isOnline) {
            return 'grey';
        }
        if (isOnline.inGame) {
            return 'orange';
        }
        return 'greenyellow';
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

    const selectUser = () => {
        if (checkUserOnline() && !checkUserGameStatus()) {
            messageService.selectMessage();
            inviteUser(element);
        }
    };
    return (
        <div
            aria-hidden
            className={styles.finder__line}
            onClick={() => selectUser()}
        >
            <Avatar avatar={element.avatar} login={element.display_name} />
            <span className={styles.finder__name}>{element.display_name}</span>
            <div
                className={styles.finder__point}
                style={{
                    background: checkUserOnline(),
                }}
            />
        </div>
    );
};
