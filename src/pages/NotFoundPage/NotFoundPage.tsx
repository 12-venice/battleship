/* eslint-disable import/no-default-export */
import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { useSelector, useDispatch } from 'react-redux';
import { setLoadingStatus } from 'src/store/reducers/user';
import { decCount, incCount } from 'src/store/reducers/counter';
import { Layout } from '../../components/Layout';

import styles from './NotFoundPage.scss';
import errorBg from '../../../images/error_img.png';

const mapStateToProps = (state: any) => ({
    user: state.user,
    state,
});

export const NotFoundPage = (): JSX.Element => {
    const userData = useSelector(mapStateToProps);
    const dispatch = useDispatch();
    console.log(userData.state);
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
                <p>{userData.user.status}</p>
                <Button
                    title="s"
                    skin="quad"
                    onClick={() => dispatch(setLoadingStatus('success'))}
                />
                <Button
                    title="e"
                    skin="quad"
                    onClick={() => dispatch(setLoadingStatus('error'))}
                />
                <Button
                    title="+"
                    skin="quad"
                    onClick={() => dispatch(incCount())}
                />
                <Button
                    title="-"
                    skin="quad"
                    onClick={() => dispatch(decCount())}
                />
            </ModalWindow>
        </Layout>
    );
};
