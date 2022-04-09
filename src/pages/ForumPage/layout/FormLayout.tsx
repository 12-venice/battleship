import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';

import styles from './FormLayout.scss';

export const FormLayout = ({children}: JSX.ElementChildrenAttribute): JSX.Element => (
    <div className={styles.form__background}>
        <header className={styles.header}>
            <div className={styles.game_tag}>
                <p>
                    BATTLESHIP
                </p>
                <h2>
                    FORUM
                </h2>
            </div>
            <NavLink to="/">
                <Button className={styles.btn} title="x" />
            </NavLink>
        </header>
        <main className={styles.main}>
            {children}
        </main>
        <footer className={styles.footer}>
            <input type="text" placeholder="Send comment..."/>
            <Button className={styles.btn} title="send" />
        </footer>
    </div>
);