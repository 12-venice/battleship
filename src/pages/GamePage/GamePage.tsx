import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { Layout } from 'src/components/Layout';

import styles from './GamePage.scss';

export const GamePage = (): JSX.Element => (
    <Layout>
        <div className={styles.forum__background}>
            <div className={styles.endGame__buttons}>
                <NavLink to="/">
                    <Button skin="quad" title="i" />
                </NavLink>
                <NavLink to="/">
                    <Button skin="quad" title="X" color="red" />
                </NavLink>
            </div>
        </div>
    </Layout>
);
