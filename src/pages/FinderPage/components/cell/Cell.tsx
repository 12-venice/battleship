/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/destructuring-assignment */
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'src/components/Avatar';
import { PageLinks } from 'src/components/utils/Routes/types';
import { User } from 'src/store/reducers/user';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { messageService } from 'src/store/services/messageService';
import { socket } from 'src/components/utils/Socket/Socket';
import styles from './Cell.scss';

export const Cell = ({ element, str }: { element: User; str: string }) => {
    const navigator = useNavigate();
    const usersOnline = useSelector((state: AllStateTypes) => state.userOnline);

    const checkUserOnline = () => {
        const isOnline = usersOnline.indexOf(element._id) !== -1;
        return !!isOnline;
    };

    const createRoom = (invitedUserId: string) => {
        socket.emit('invite:sent', invitedUserId);
    };

    const inviteUser = (invitedUserId: string, room: string) => {
        socket.emit('invite:sent', invitedUserId);
        navigator(`${PageLinks.game}/${room}`);
    };

    const selectUser = () => {
        messageService.selectMessage();
        str ? createRoom(element._id) : inviteUser(element._id, element.room!);
    };
    return (
        <div
            aria-hidden
            className={styles.finder__line}
            onClick={() => selectUser()}
        >
            <Avatar avatar={element.avatar} login={element.display_name} />
            <span className={styles.finder__name}>{element.display_name}</span>
            {!str && (
                <div
                    className={styles.finder__point}
                    style={{
                        background: checkUserOnline() ? 'greenyellow' : 'gray',
                    }}
                />
            )}
        </div>
    );
};
