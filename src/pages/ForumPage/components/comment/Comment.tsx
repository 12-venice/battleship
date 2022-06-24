// @ts-nocheck
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { Preloader } from 'src/components/Preloader';
import { useCallback, useEffect, useState } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import cn from 'classnames';
import { messageService } from 'src/store/services/messageService';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import styles from './Comment.scss';
import { CommentProps } from './types';

export const Comment = (comment: CommentProps): JSX.Element => {
    const [state, toggleState] = useState(false);
    const [comments, setComments] = useState([]);
    const { request, loading } = useHttp();
    const currentUser = useSelector(
        (userState: AllStateTypes) => userState.user.item,
    );
    const selectComment = useSelector(
        (messageState: AllStateTypes) => messageState.message.comment,
    );

    const getComments = useCallback(async () => {
        const data = await request('/api/comment/read', 'POST', {
            comment: comment._id,
        });
        setComments(data);
    }, [request, comment._id]);

    const handleClick = () => {
        if (comment.subcomments.length > 0) {
            getComments();
        }
        messageService.selectComment({
            topic: comment.topic,
            comment: comment._id,
            message: comment.message,
        });
        toggleState(!state);
    };

    useEffect(() => {
        if (state) {
            getComments();
        }
    }, [getComments, state]);

    return (
        <>
            <div
                aria-hidden
                className={cn(
                    styles.comment,
                    selectComment === comment._id && styles.comment__active,
                )}
                onClick={handleClick}
            >
                <div className={styles.comment__header}>
                    {comment.message.match(/^\/image\//gm) ? (
                        <img
                            className={styles.comment__image}
                            src={comment.message}
                            alt="img"
                        />
                    ) : (
                        <p className={styles.comment__description}>
                            {comment.message}
                        </p>
                    )}
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
                        {comment.user?._id === currentUser?._id && (
                            <div className={styles.topic__controls}>
                                <i
                                    aria-hidden
                                    className="small material-icons"
                                    onClick={() => {
                                        comment.editFunc();
                                    }}
                                >
                                    edit
                                </i>
                                <i
                                    aria-hidden
                                    className="small material-icons"
                                    onClick={() => comment.deleteFunc()}
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
                comments.length > 0 &&
                comments.map((subcomment: CommentProps) => (
                    <Comment
                        key={subcomment._id.toString()}
                        _id={subcomment._id}
                        topic={subcomment.topic}
                        message={subcomment.message}
                        user={subcomment.user}
                        createdAt={subcomment.createdAt}
                        subcomments={subcomment.subcomments}
                        deleteFunc={() => {
                            comment.deleteFunc();
                        }}
                        editFunc={() => {
                            comment.editFunc();
                        }}
                    />
                ))
            ) : (
                <Preloader />
            )}
        </>
    );
};
