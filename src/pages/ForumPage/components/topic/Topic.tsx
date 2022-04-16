/* eslint-disable operator-linebreak */
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { Props, handleClickType } from './types';
import { Comment } from '../comment';

import styles from './Topic.scss';

export const Topic: Props = ({
    date = '',
    name = 'Noname',
    theme = 'Topic',
    description = 'Default description...',
    comments,
    _id,
    setTopicId,
}): JSX.Element => {
    const [state, toggleState] = useState(false);

    const handleClick: handleClickType = () => {
        toggleState(!state);
        setTopicId(_id);
    };
    return (
        <div>
            <div
                className={styles.topic}
                onClick={handleClick}
                aria-hidden="true"
            >
                <div className={styles.topic__header}>
                    <h2 className={styles['topic__header-theme']}>{theme}</h2>
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
                        key={uuidv4()}
                        user={comment.user}
                        date={DateParser(comment.date)}
                        description={comment.description}
                    />
                ))}
        </div>
    );
};
