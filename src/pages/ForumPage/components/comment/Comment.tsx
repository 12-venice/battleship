import { Props } from './types';

import styles from './Comment.scss';
import { Button } from 'src/components/Button';

export const Comment: Props = ({date, name, description}): JSX.Element => {
    return (
        <div className={styles.comment}>
            <header className={styles.header}>
                <p className={styles.description}>
                    { description ? description : 'No description...' }
                </p>
                <div className={styles.author}>
                    <h3 className={styles.name}>
                        { name ? name : "NoName" }
                    </h3>
                    <p className={styles.date}>
                        { date ? date : '' }
                    </p>
                </div>
            </header>
            <Button className={styles.btn_comment} title="Comment" />
        </div>
    );
};