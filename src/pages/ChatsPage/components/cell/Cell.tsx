// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/destructuring-assignment */
import { Avatar } from 'src/components/Avatar';
import { User } from 'src/store/reducers/user';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import styles from './Cell.scss';

export const Cell = ({
    element,
    selectUser,
}: {
    element: User;
    selectUser: Function;
}) => {
    const usersOnline = useSelector((state: AllStateTypes) => state.userOnline);

    // const checkUserOnline = () => {
    //     const isOnline = usersOnline.indexOf(element._id) !== -1;
    //     return !!isOnline;
    // };
    const checkUserOnline = () => {
        const isOnline = usersOnline.filter((u) => u.id === element._id).length;
        return !!isOnline;
    };
    const checkUserGameStatus = () => {
        const inspectUser = usersOnline.filter((u) => u.id === element._id);
        if (inspectUser.length > 0) {
            return inspectUser[0].inGame;
        }
        return false;
    };
    return (
        <div
            aria-hidden
            className={styles.cell__line}
            onClick={() => selectUser(element)}
        >
            <Avatar avatar={element.avatar} login={element.display_name} />
            <span className={styles.cell__name}>{element.display_name}</span>
            <div
                className={styles.cell__point}
                style={{
                    background: checkUserOnline()
                        ? checkUserGameStatus()
                            ? 'orange'
                            : 'greenyellow'
                        : 'gray',
                }}
            />
        </div>
    );
};
