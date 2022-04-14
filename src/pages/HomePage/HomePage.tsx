import cn from 'classnames';
import { Button } from 'src/components/Button';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/auth.hook';
import { PageLinks } from 'src/components/utils/Routes/types';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.png';
import { Layout } from '../../components/Layout';
import styles from './HomePage.scss';
import { Information } from '../../components/Information';

export const HomePage = (): JSX.Element => {
    const history = useHistory();
    const { isAuth, logout } = useAuth();
    const [typeOfGame, setTypeOfGame] = useState(false);
    const [leftBlock, setLeftBlock] = useState(<div />);
    const [rightBlock, setRightBlock] = useState(<div />);
    const [info, setInfo] = useState(false);
    const getInfo = () => setInfo(!info);

    useEffect(() => {
        if (isAuth) {
            setLeftBlock(
                <Button
                    onClick={() => history.push(PageLinks.profile)}
                    title="PROFILE"
                />,
            );
            setRightBlock(
                <Button
                    onClick={logout}
                    skin="auth"
                    color="blue"
                    title="LOG OUT"
                />,
            );
        } else {
            setLeftBlock(<div />);
            setRightBlock(
                <>
                    <span
                        aria-hidden="true"
                        className={styles['home__button-span']}
                        onClick={() => history.push(PageLinks.auth)}
                    >
                        LOG IN
                    </span>
                    <Button
                        onClick={() => history.push(PageLinks.profile)}
                        color="green"
                        title="SIGN UP"
                    />
                </>,
            );
        }
    }, [history, isAuth, logout]);
    return (
        <Layout>
            {info && <Information close={getInfo} />}
            <div className={styles.home__main}>
                <div className={styles.home__buttons}>
                    <div className={styles['home__buttons-block']}>
                        <Button
                            onClick={() => history.push(PageLinks.forum)}
                            title="FORUM"
                        />
                        <Button
                            onClick={() => history.push(PageLinks.home)}
                            title="LEADERS"
                        />
                        {leftBlock}
                        <Button skin="quad" onClick={getInfo} title="i" />
                    </div>
                    <div className={styles['home__buttons-block']}>
                        {rightBlock}
                    </div>
                </div>
                <img
                    className={styles['home__image-left']}
                    src={menuLogoWithShips}
                    alt="Логотип с кораблями"
                />
                <span className={styles.home__header}>BATTLESHIP</span>
                <div className={styles.home__menu}>
                    <div className={styles.home__select}>
                        <div>
                            <div className="switch">
                                <label htmlFor="toggle">
                                    <input
                                        id="toggle"
                                        type="checkbox"
                                        checked={typeOfGame}
                                        onChange={() => {
                                            setTypeOfGame(!typeOfGame);
                                        }}
                                    />
                                    <span className="lever" />
                                    <span
                                        className={
                                            styles[
                                                'home__select-toggle-logotype'
                                            ]
                                        }
                                    >
                                        Toggle play mode!
                                    </span>
                                </label>
                            </div>
                            <div className="home__select-type">
                                <span
                                    className={cn(
                                        styles['home__select-type-logotype'],
                                        !typeOfGame ? styles.selected : '',
                                    )}
                                >
                                    CLASSIC
                                </span>
                                <span
                                    className={cn(
                                        styles['home__select-type-logotype'],
                                        typeOfGame ? styles.selected : '',
                                    )}
                                >
                                    ONLINE
                                </span>
                            </div>
                        </div>
                        <Button
                            skin="large"
                            color="green"
                            onClick={() => history.push(PageLinks.auth)}
                            title="PLAY"
                        />
                    </div>
                    <img
                        className={styles['home__image-right']}
                        src={menuLogoWithPirates}
                        alt="Логотип с пиратами"
                    />
                </div>
            </div>
        </Layout>
    );
};
