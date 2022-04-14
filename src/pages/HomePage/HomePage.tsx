import cn from 'classnames';
import { Button } from 'src/components/Button';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { PageLinks } from 'src/components/utils/Routes/types';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.png';
import { Layout } from '../../components/Layout';
import styles from './HomePage.scss';

export const HomePage = (): JSX.Element => {
    const [typeOfGame, setTypeOfGame] = useState(false);

    return (
        <Layout>
            <div className={styles.home__main}>
                <div className={styles.home__buttons}>
                    <NavLink to={PageLinks.forum}>
                        <Button title="FORUM" />
                    </NavLink>
                    <NavLink to="/">
                        <Button title="LEADERS" />
                    </NavLink>
                    <NavLink to={PageLinks.profile}>
                        <Button title="PROFILE" />
                    </NavLink>
                    <NavLink to="/">
                        <Button title="i" skin="quad" />
                    </NavLink>
                    <NavLink to={PageLinks.auth}>
                        <Button skin="auth" title="LOG OUT" color="blue" />
                    </NavLink>
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
                        <NavLink to={PageLinks.auth}>
                            <Button skin="large" color="green" title="PLAY" />
                        </NavLink>
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
