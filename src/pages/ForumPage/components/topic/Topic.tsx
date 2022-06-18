/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { AllStateTypes } from 'src/store/reducers';
import { useHttp } from 'src/hooks/http.hook';
import { Preloader } from 'src/components/Preloader';
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { handleClickType, TopicProps } from './types';
import { Comment } from '../comment';
import styles from './Topic.scss';
import { CommentProps } from '../comment/types';

export const Topic = (topic: TopicProps): JSX.Element => {
    const [state, toggleState] = useState(false);
    const [comments, setComments] = useState([]);
    const currentUser = useSelector(
        (userState: AllStateTypes) => userState.user.item,
    );
    const { request, loading } = useHttp();
    const handleClick: handleClickType = () => {
        toggleState(!state);
        topic.setTopicId(topic._id);
    };

    const getComments = useCallback(async () => {
        const data = await request('/api/comment/read', 'POST', {
            _id: topic._id,
        });
        setComments(data);
    }, [request, topic._id]);

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
                    topic.isActiveTopic === topic._id
                        ? styles.topic_active
                        : styles.topic_unactive,
                )}
                onClick={handleClick}
                aria-hidden="true"
            >
                <div className={styles.topic__header}>
                    <div>
                        <h2 className={styles['topic__header-theme']}>
                            {topic.theme}
                        </h2>
                        {topic.user?._id === currentUser?._id && (
                            <div className={styles.topic__controls}>
                                <i
                                    className="small material-icons"
                                    onClick={() => {
                                        topic.editFunc(
                                            topic._id,
                                            topic.theme,
                                            topic.message,
                                        );
                                    }}
                                    onKeyDown={() => {
                                        // do nothing.
                                    }}
                                >
                                    edit
                                </i>
                                <i
                                    className="small material-icons"
                                    onClick={() => topic.deleteFunc(topic._id)}
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
                            {topic.user?.display_name}
                        </h3>
                        <p className={styles['topic__header-author-date']}>
                            {DateParser(topic.createdAt)}
                        </p>
                    </div>
                </div>
                <p className={styles.topic__description}>{topic.message}</p>
            </div>
            {!loading ? (
                state &&
                (comments.length > 0 ? (
                    comments.map((comment: CommentProps) => (
                        <Comment {...comment} />
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
