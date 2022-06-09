import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { AllStateTypes } from 'src/store/reducers';
import { useHttp } from 'src/hooks/http.hook';
import { Preloader } from 'src/components/Preloader';
import { Props, handleClickType } from './types';
import { Comment } from '../comment';

import styles from './Topic.scss';
import { CommentProps } from '../comment/types';

export const Topic: Props = ({
    createdAt = '',
    user = { display_name: 'Noname' },
    theme = 'Topic',
    description = 'Default description...',
    _id,
    setTopicId,
    deleteFunc,
    editFunc,
    isActiveTopic,
}): JSX.Element => {
    const [state, toggleState] = useState(false);
    const [comments, setComments] = useState([]);
    const [select, toggleSelect] = useState(false);
    const currentUser = useSelector(
        (userState: AllStateTypes) => userState.user.item,
    );
    const { request, loading } = useHttp();
    const handleClick: handleClickType = () => {
        toggleState(!state);
        toggleSelect(!select);
        setTopicId(_id);
    };

    const getComments = useCallback(async () => {
        const data = await request('/api/comment/read', 'POST', { _id });
        setComments(data);
    }, [_id, request]);

    useEffect(() => {
        if (state) {
            getComments();
        }
    }, [getComments, state]);

    return (
        <div>
            <div
                className={cn(
                    styles.topic,
                    isActiveTopic === _id
                        ? styles.topic_active
                        : styles.topic_unactive,
                )}
                onClick={handleClick}
                aria-hidden="true"
            >
                <div className={styles.topic__header}>
                    <div>
                        <h2 className={styles['topic__header-theme']}>
                            {theme}
                        </h2>
                        {user?._id === currentUser?._id && (
                            <div className={styles.topic__controls}>
                                <i
                                    className="small material-icons"
                                    onClick={() => {
                                        editFunc(_id, theme, description);
                                    }}
                                    onKeyDown={() => {
                                        // do nothing.
                                    }}
                                >
                                    edit
                                </i>
                                <i
                                    className="small material-icons"
                                    onClick={() => deleteFunc(_id)}
                                    onKeyDown={() => {
                                        // do nothing.
                                    }}
                                >
                                    delete
                                </i>
                            </div>
                        )}
                    </div>
                    <div className={styles['topic__header-author']}>
                        <h3 className={styles['topic__header-author-name']}>
                            {user?.display_name}
                        </h3>
                        <p className={styles['topic__header-author-date']}>
                            {createdAt}
                        </p>
                    </div>
                </div>
                <p className={styles.topic__description}>{description}</p>
            </div>
            {!loading ? (
                state &&
                (comments.length > 0 ? (
                    comments.map((comment: CommentProps) => (
                        <Comment
                            key={comment._id}
                            user={comment.user}
                            createdAt={DateParser(comment.createdAt)}
                            description={comment.description}
                            _id={comment._id}
                        />
                    ))
                ) : (
                    <div className={styles.topic}>
                        There are no comments yet...
                    </div>
                ))
            ) : (
                <Preloader />
            )}
        </div>
    );
};
