/* eslint-disable react/destructuring-assignment */
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { AllStateTypes } from 'src/store/reducers';
import { useHttp } from 'src/hooks/http.hook';
import { Preloader } from 'src/components/Preloader';
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { messageService } from 'src/store/services/messageService';
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
    const selectTopic = useSelector(
        (messageState: AllStateTypes) => messageState.message.topic,
    );

    const { request, loading } = useHttp();
    const handleClick: handleClickType = () => {
        toggleState(!state);
        messageService.selectTopic({
            topic: topic._id,
            theme: topic.theme,
            description: topic.description,
        });
    };

    const getComments = useCallback(async () => {
        const data = await request('/api/comment/read', 'POST', {
            topic: topic._id,
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
                    selectTopic === topic._id && styles.topic__active,
                )}
                onClick={handleClick}
                aria-hidden="true"
            >
                <div className={styles.topic__header}>
                    <div>
                        <h2 className={styles['topic__header-theme']}>
                            {topic.theme}
                        </h2>
                        <p className={styles.topic__description}>
                            {topic.description}
                        </p>
                    </div>
                    <div className={styles['topic__header-author']}>
                        <h3 className={styles['topic__header-author-name']}>
                            {topic.user?.display_name}
                        </h3>
                        <p className={styles['topic__header-author-date']}>
                            {DateParser(topic.createdAt)}
                        </p>
                        {topic.user?._id === currentUser?._id && (
                            <div className={styles.topic__controls}>
                                <i
                                    aria-hidden
                                    className="small material-icons"
                                    onClick={() => {
                                        topic.editFunc();
                                    }}
                                >
                                    edit
                                </i>
                                <i
                                    aria-hidden
                                    className="small material-icons"
                                    onClick={() => topic.deleteFunc()}
                                >
                                    delete
                                </i>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {!loading ? (
                state &&
                (comments.length > 0 ? (
                    comments.map((comment: CommentProps) => (
                        <Comment
                            key={comment._id}
                            _id={comment._id}
                            topic={comment.topic}
                            message={comment.message}
                            user={comment.user}
                            createdAt={comment.createdAt}
                            subcomments={comment.subcomments}
                            deleteFunc={() => {
                                topic.deleteFunc();
                            }}
                            editFunc={() => {
                                topic.editFunc();
                            }}
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
