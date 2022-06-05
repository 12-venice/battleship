/* eslint-disable react-hooks/exhaustive-deps */
import cn from 'classnames';
import moment from 'moment';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import styles from './Message.scss';
import { messageType } from './types';

export const Message = (message: messageType): JSX.Element => {
    const { _id, date, text, user, delivered } = message;
    const { request } = useHttp();
    const thisUser = useSelector((state: AllStateTypes) => state.user.item);
    const notme = user._id !== thisUser?._id;
    moment.locale('ru');
    const parseDate = moment(date).fromNow();

    useEffect(() => {
        if (!delivered && notme) {
            request('/api/message/setdelivered', 'POST', { _id }, {}, true);
        }
    }, []);

    return (
        <div
            className={cn(
                styles.message__row,
                notme && styles.message__row__notme,
            )}
        >
            <div
                className={cn(
                    styles.message__block,
                    notme && styles.message__block__notme,
                )}
            >
                <div className={styles.message__text}>{text}</div>
                <div className={styles.message__date}>
                    {parseDate}
                    {delivered && !notme && (
                        <i className="material-icons tiny">check</i>
                    )}
                </div>
            </div>
        </div>
    );
};
