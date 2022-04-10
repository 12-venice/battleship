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
            { state ? children : ''}
        </div>
    );
};