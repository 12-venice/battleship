/* eslint-disable import/no-default-export */
import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { useSelector } from 'react-redux';
import { Layout } from '../../components/Layout';

import styles from './NotFoundPage.scss';
import errorBg from '../../../images/error_img.png';

const mapStateToProps = (state: any) => ({
    state,
    user: state.user,
});

export const NotFoundPage = (): JSX.Element => {
    const userData = useSelector(mapStateToProps);
    console.log(userData, userData.state, userData.user);
    return (
        <Layout>
            <ModalWindow noBackground>
                <img
                    className={styles.error__logo}
                    src={errorBg}
                    alt="error img"
                />
                <NavLink to="/" className={styles.error__button}>
                    <Button skin="high" title="HOME" color="yellow" />
                </NavLink>
            </ModalWindow>
        </Layout>
    );
};
