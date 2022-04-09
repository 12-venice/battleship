import { useState } from 'react';

import { Props, handleClickType } from './types';

import styles from './Topic.scss';

export const Topic: Props = ({date, name, theme, description, children}): JSX.Element => {

    const [state, toggleState] = useState(false);

    const handleClick: handleClickType = (event) => {
        toggleState(!state);
    };

    return (
        <div>
            <div className={styles.topic} onClick={handleClick}>
                <header className={styles.header}>
                    <h2 className={styles.theme}>
                        { theme ? theme : "Topic" }
                    </h2>
                    <div className={styles.author}>
                        <h3 className={styles.name}>
                            { name ? name : "NoName" }
                        </h3>
                        <p className={styles.date}>
                            { date ? date : '' }
                        </p>
                    </div>
                </header>
                <p className={styles.description}>
                { description ? description : 'No description...' }
                </p>
            </div>
            { state ? children : ''}
        </div>
    );
};