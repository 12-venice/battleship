import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { Layout } from '../../components/Layout';

import styles from './NotFoundPage.scss';
import background from '../../../images/error_img.png';

export const NotFoundPage = (): JSX.Element => (
    <Layout>
        <div className={styles.bg}>
            <div
                className={styles.defeat_bg}
                style={{
                    backgroundImage: `url(${background})`,
                }}
            >
                <NavLink to="/">
                    <Button skin="high" title="back" />
                </NavLink>
            </div>
        </div>
    </Layout>
);
