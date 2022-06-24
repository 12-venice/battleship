// @ts-nocheck
import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { Layout } from '../../components/Layout';

import styles from './NotFoundPage.scss';
import errorBg from '../../../images/error_img.png';

export const NotFoundPage = (): JSX.Element => (
    <Layout>
        <ModalWindow noBackground>
            <img className={styles.error__logo} src={errorBg} alt="error img" />
            <NavLink to="/" className={styles.error__button}>
                <Button skin="high" title="HOME" color="yellow" />
            </NavLink>
        </ModalWindow>
    </Layout>
);
