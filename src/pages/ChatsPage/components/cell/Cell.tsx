/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/destructuring-assignment */
import { Avatar } from 'src/components/Avatar';
import { User } from 'src/store/reducers/user';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { messageService } from 'src/store/services/messageService';
import styles from './Cell.scss';

export const Cell = ({
    element,
    selectUser,
}: {
    element: User;
    selectUser: any;
}) => {
    const usersOnline = useSelector((state: AllStateTypes) => state.userOnline);

    const checkUserOnline = () => {
        const isOnline = usersOnline.indexOf(element._id) !== -1;
        return !!isOnline;
    };
    const selectChatUser = () => {
        messageService.selectMessage();
        selectUser(element);
    };
    return (
        <div
            key={element._id}
            aria-hidden
            className={styles.cell__line}
            onClick={() => selectChatUser()}
        >
            <Avatar avatar={element.avatar} login={element.display_name} />
            <span className={styles.cell__name}>{element.display_name}</span>
            <div
                className={styles.cell__point}
                style={{
                    background: checkUserOnline() ? 'greenyellow' : 'gray',
                }}
            />
        </div>
    );
};
