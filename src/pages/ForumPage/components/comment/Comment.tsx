import { Props } from './types';

import styles from './Comment.scss';

export const Comment: Props = ({
    date = '',
    name = 'Noname',
    description = 'Default description...',
}): JSX.Element => (
    <div className={styles.comment}>
        <div className={styles.header}>
            <p className={styles.description}>{description}</p>
            <div className={styles.author}>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.date}>{date}</p>
            </div>
        </div>
    </div>
);
