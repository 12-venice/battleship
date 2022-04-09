import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { Layout } from '../../components/Layout';

import styles from './NotFoundPage.scss';
import background from '../../../images/error_img.png';

export const NotFoundPage = (): JSX.Element => {
    return (
        <Layout>
            <div className={styles.bg}>
                <div className={styles.defeat_bg} style={{
                    backgroundImage: `url(${background})`,
                    width: '600px',
                    height: '849px',
                    display: 'flex',
                    margin: '40px auto',
                    justifyContent: 'center',
                }}>
                        <NavLink to="/">
                            <Button className={`${styles.btn} ${styles.btn_yellow}`} title="back" />
                        </NavLink>
                </div>
            </div>
        </Layout>
    );
};