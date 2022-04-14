import cn from 'classnames';
import { Button } from 'src/components/Button';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/auth.hook';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.png';
import { Layout } from '../../components/Layout';
import styles from './HomePage.scss';
import stylesButton from '../../components/Button/Button.scss';

export const HomePage = (): JSX.Element => {
    const history = useHistory();
    const { isAuth, logout } = useAuth();
    const [typeOfGame, setTypeOfGame] = useState(false);
    const [leftBlock, setLeftBlock] = useState(<div />);
    const [rightBlock, setRightBlock] = useState(<div />);

    useEffect(() => {
        if (isAuth) {
            setLeftBlock(
                <Button
                    onClick={() => history.push('/profile')}
                    title="PROFILE"
                />,
            );
            setRightBlock(
                <Button
                    onClick={() => logout()}
                    className={stylesButton.blue}
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
                        onClick={() => history.push('/auth')}
                    >
                        LOG IN
                    </span>
                    <Button
                        onClick={() => history.push('/register')}
                        className={stylesButton.green}
                        title="SIGN UP"
                    />
                </>,
            );
        }
    }, [history, isAuth, logout]);
    return (
        <Layout>
            <div className={styles.home__main}>
                <div className={styles.home__buttons}>
                    <div className={styles['home__buttons-block']}>
                        <Button
                            onClick={() => history.push('/forum')}
                            title="FORUM"
                        />
                        <Button
                            onClick={() => history.push('/')}
                            title="LEADERS"
                        />
                        {leftBlock}
                        <Button
                            onClick={() => history.push('/')}
                            className={stylesButton.slim}
                            title="i"
                        />
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
                            className={cn(stylesButton.green, stylesButton.big)}
                            onClick={() => history.push('/battleship')}
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
