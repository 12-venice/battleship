/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { Preloader } from 'src/components/Preloader';
import { useCallback, useEffect, useState } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import styles from './Comment.scss';
import { CommentProps } from './types';
import { handleClickType } from '../topic/types';

export const Comment = (comment: CommentProps): JSX.Element => {
    const [state, toggleState] = useState(false);
    const [comments, setComments] = useState([]);
    const { request, loading } = useHttp();
    const handleClick: handleClickType = () => {
        toggleState(!state);
        topic.setTopicId(topic._id);
    };

    const getComments = useCallback(async () => {
        const data = await request('/api/comment/read', 'POST', {
            _id: comment._id,
            type: 'comment',
        });
        setComments(data);
    }, [request, comment._id]);

    useEffect(() => {
        if (state) {
            getComments();
        }
    }, [getComments, state]);

    return (
        <>
            <div aria-hidden className={styles.comment} onClick={handleClick}>
                <div className={styles.comment__header}>
                    <p className={styles.comment__description}>
                        {comment.message}
                    </p>
                    <div className={styles.comment__author}>
                        <h3 className={styles['comment__author-name']}>
                            {comment.user.display_name}
                        </h3>
                        <p className={styles['comment__author-date']}>
                            {DateParser(comment.createdAt)}
                        </p>
                        <p className={styles['comment__author-name']}>
                            {comment.subcomments.length > 0 &&
                                `Комментариев: ${comment.subcomments.length}`}
                        </p>
                    </div>
                </div>
            </div>
            {!loading ? (
                state &&
                comments.length > 0 &&
                comments.map((subcomment: CommentProps) => (
                    <Comment key={subcomment._id} {...subcomment} />
                ))
            ) : (
                <Preloader />
            )}
        </>
    );
};
