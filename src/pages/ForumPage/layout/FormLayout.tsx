import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';

import styles from './FormLayout.scss';

export const FormLayout = ({
    children,
}: JSX.ElementChildrenAttribute): JSX.Element => (
    <div className={styles.form__background}>
        <div className={styles.header}>
            <div className={styles.game_tag}>
                <p>BATTLESHIP</p>
                <h2>FORUM</h2>
            </div>
            <NavLink to="/">
                <Button className={styles.btn} title="x" />
            </NavLink>
        </div>
        <div className={styles.main}>{children}</div>
        <div className={styles.footer}>
            <input type="text" placeholder="Send comment..." />
            <Button className={styles.btn} title="send" />
        </div>
    </div>
);
