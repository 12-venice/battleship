import { useCallback, useContext, useEffect, useState } from 'react';
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { AuthContext } from 'src/context/Authcontext';
import { useHttp } from 'src/hooks/http.hook';
import { Preloader } from 'src/components/Preloader';
import { Props, handleClickType } from './types';
import { Comment } from '../comment';

import styles from './Topic.scss';

export const Topic: Props = ({
    date = '',
    name = 'Noname',
    theme = 'Topic',
    description = 'Default description...',
    id,
    setTopicId,
    deleteFunc,
    editFunc,
}): JSX.Element => {
    const [state, toggleState] = useState(false);
    const [comments, setComments] = useState([]);
    const { user } = useContext(AuthContext);
    const { request, loading } = useHttp();
    const handleClick: handleClickType = () => {
        toggleState(!state);
        setTopicId(id);
    };

    const getComments = useCallback(async () => {
        const data = await request(
            '/api/comment/read',
            'POST',
            { _id: id },
            {},
            true,
        );
        setComments(data);
    }, [id, request]);

    useEffect(() => {
        if (state) {
            getComments();
        }
    }, [getComments, state]);

    return (
        <div>
            <div
                className={styles.topic}
                onClick={handleClick}
                aria-hidden="true"
            >
                <div className={styles.topic__header}>
                    <div>
                        <h2 className={styles['topic__header-theme']}>
                            {theme}
                        </h2>
                        {name === user?.display_name && (
                            <div className={styles.topic__controls}>
                                <i
                                    className="small material-icons"
                                    onClick={() => {
                                        editFunc(id, theme, description);
                                    }}
                                    onKeyDown={() => {
                                        // do nothing.
                                    }}
                                >
                                    edit
                                </i>
                                <i
                                    className="small material-icons"
                                    onClick={() => deleteFunc(id)}
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
                            {name}
                        </h3>
                        <p className={styles['topic__header-author-date']}>
                            {date}
                        </p>
                    </div>
                </div>
                <p className={styles.topic__description}>{description}</p>
            </div>
            {!loading ? (
                state &&
                (comments.length > 0 ? (
                    comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            user={comment.user}
                            date={DateParser(comment.date)}
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
