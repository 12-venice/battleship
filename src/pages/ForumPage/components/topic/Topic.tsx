import { useState } from 'react';

import { Props, handleClickType } from './types';
import { Comment } from '../comment';

import styles from './Topic.scss';

export const Topic: Props = ({date, name, theme, description, comments}): JSX.Element => {

    const [state, toggleState] = useState(false);

    const handleClick: handleClickType = (event) => {
        toggleState(!state);
    };

    return (
        <div>
            <div className={styles.topic} onClick={handleClick}>
                <div className={styles.header}>
                    <h2 className={styles.theme}>
                        { theme }
                    </h2>
                    <div className={styles.author}>
                        <h3 className={styles.name}>
                            { name }
                        </h3>
                        <p className={styles.date}>
                            { date }
                        </p>
                    </div>
                </div>
                <p className={styles.description}>
                { description }
                </p>
            </div>
            { state && comments && comments.map(comment => (
                <Comment name={comment.name} date={comment.date} description={comment.description}/>
            ))}
        </div>
    );
};

Topic.defaultProps = {
    name: "Noname",
    date: '',
    description: "Default description...",
    theme: "Topic"
}