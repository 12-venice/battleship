import cn from 'classnames';
import { useContext, useState } from 'react';
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { AuthContext } from 'src/context/Authcontext';
import { Props, handleClickType } from './types';
import { Comment } from '../comment';

import styles from './Topic.scss';

export const Topic: Props = ({
    date = '',
    name = 'Noname',
    theme = 'Topic',
    description = 'Default description...',
    comments,
    id,
    setTopicId,
    deleteFunc,
    editFunc,
    isActiveTopic,
}): JSX.Element => {
    const [state, toggleState] = useState(false);
    const [select, toggleSelect] = useState(false);
    const { user } = useContext(AuthContext);
    const handleClick: handleClickType = (e: any) => {
        if (e.target.outerText === ('edit' || 'delete')) {
            setTopicId(id);
            return;
        }
        toggleState(!state);
        toggleSelect(!select);
        setTopicId(id);
    };
    return (
        <div>
            <div
                className={cn(
                    styles.topic,
                    isActiveTopic === id
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
            {state &&
                comments &&
                comments.map((comment) => (
                    <Comment
                        key={comment._id}
                        user={comment.user}
                        date={DateParser(comment.date)}
                        description={comment.description}
                    />
                ))}
        </div>
    );
};
