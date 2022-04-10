import { Props } from './types';

import styles from './Comment.scss';
import { Button } from 'src/components/Button';

export const Comment: Props = ({date, name, description}): JSX.Element => {
    return (
        <div className={styles.comment}>
            <div className={styles.header}>
                <p className={styles.description}>
                    { description }
                </p>
                <div className={styles.author}>
                    <h3 className={styles.name}>
                        { name }
                    </h3>
                    <p className={styles.date}>
                        { date }
                    </p>
                </div>
            </div>
            <Button className={styles.btn_comment} title="Comment" />
        </div>
    );
};