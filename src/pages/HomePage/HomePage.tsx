import cn from 'classnames';
import { Button } from 'src/components/Button';
import { useContext, useState } from 'react';
import { PageLinks } from 'src/components/utils/Routes/types';
import { AuthContext } from 'src/context/Authcontext';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.png';
import { Layout } from '../../components/Layout';
import styles from './HomePage.scss';
import { Information } from '../../components/Information';

export const HomePage = (): JSX.Element => {
    const { user, logout } = useContext(AuthContext);
    const [typeOfGame, setTypeOfGame] = useState(false);
    const [info, setInfo] = useState(false);
    const getInfo = () => setInfo(!info);
    const leftBlock = () => {
        if (user) {
            return <Button href={PageLinks.profile} title="PROFILE" />;
        }
        return null;
    };

    const rightBlock = () => {
        if (user) {
            return (
                <Button
                    onClick={logout}
                    skin="auth"
                    color="blue"
                    title="LOG OUT"
                />
            );
        }
        return (
            <>
                <Button
                    href={PageLinks.auth}
                    skin="auth"
                    noFill
                    title="LOG IN"
                />
                <Button
                    href={PageLinks.register}
                    color="green"
                    title="SIGN UP"
                />
            </>
        );
    };

    return (
        <Layout>
            {info && <Information close={getInfo} />}
            <div className={styles.home__main}>
                <div className={styles.home__buttons}>
                    <div className={styles['home__buttons-block-left']}>
                        <Button href={PageLinks.forum} title="FORUM" />
                        <Button href={PageLinks.leaderboard} title="LEADERS" />
                        {leftBlock()}
                        <Button skin="quad" onClick={getInfo} title="i" />
                    </div>
                    <div className={styles['home__buttons-block-right']}>
                        {rightBlock()}
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
                            skin={window.innerWidth < 450 ? '' : 'large'}
                            color="green"
                            href={PageLinks.game}
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
