import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { Layout } from 'src/components/Layout';

import styles from './GamePage.scss';

export const GamePage = (): JSX.Element => (
    <Layout>
        <div className={styles.endGame__buttons}>
            <NavLink to="/">
                <Button skin="high" title="PLAY" color="green" />
            </NavLink>
            <NavLink to="/">
                <Button skin="high" title="QUIT" color="yellow" />
            </NavLink>
        </div>
    </Layout>
);
