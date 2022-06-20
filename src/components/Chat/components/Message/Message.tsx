/* eslint-disable no-param-reassign */
import cn from 'classnames';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { socket } from 'src/components/utils/Socket/Socket';
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import styles from './Message.scss';
import { messageType } from './types';

export const Message = (message: messageType): JSX.Element => {
    const { _id, createdAt, text, user, delivered } = message;
    const { request } = useHttp();
    const [deliver, setDeliver] = useState(delivered);
    const thisUser = useSelector((state: AllStateTypes) => state.user.item);
    const myMsg = user._id === thisUser?._id;
    console.log(user._id, thisUser?._id);

    moment.locale('ru');
    const parseDate = moment(createdAt).fromNow();

    useEffect(() => {
        socket.on('message:delivered', (id: string) => {
            if (id === _id && myMsg) {
                setDeliver(true);
            }
        });
        return () => {
            socket.off('message:delivered');
        };
    }, [_id, myMsg]);

    useEffect(() => {
        if (!delivered && !myMsg) {
            request('/api/message/setdelivered', 'POST', { _id });
        }
    }, [_id, delivered, myMsg, request]);

    return (
        <div
            className={cn(
                styles.message__row,
                myMsg && styles.message__row__notme,
            )}
        >
            {text.match(/^\/image\//gm) ? (
                <img className={styles.message__image} src={text} alt="img" />
            ) : (
                <div className={styles.message__text}>{text}</div>
            )}
            <div className={styles.message__date}>
                <p>{parseDate}</p>
                <p>{deliver && myMsg && 'Прочитано'}</p>
            </div>
        </div>
    );
};
