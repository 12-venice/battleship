import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { Layout } from '../../components/Layout';

import styles from './EndGamePage.scss';
import background from '../../../images/defeat_img.png';

export const EndGamePage = (): JSX.Element => {
    return (
        <Layout>
            <div className={styles.bg}>
                <div className={styles.defeat_bg} style={{
                    backgroundImage: `url(${background})`,
                    width: '712px',
                    height: '867px',
                    display: 'block',
                    margin: '0 auto'
                }}>
                    <div className={styles.buttons}>
                        <NavLink to="/startgame">
                            <Button className={`${styles.btn} ${styles.btn_green}`} title="play" />
                        </NavLink>
                        <NavLink to="/">
                            <Button className={`${styles.btn} ${styles.btn_yellow}`} title="quit" />
                        </NavLink>
                    </div>
                </div>
            </div>
        </Layout>
    );
};