/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { useState } from 'react';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useAuth } from 'src/hooks/auth.hook';
import { AllStateTypes } from 'src/store/reducers';
import { lngService } from 'src/store/services/lngService';
import { opponentService } from 'src/store/services/opponentService';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.png';
import exitIcon from '../../../images/exit.svg';
import profileIcon from '../../../images/profile.svg';
import loginIcon from '../../../images/login.svg';
import registrationIcon from '../../../images/registration.svg';
import bigShip from '../../../images/4-ship.png';
import { Layout } from '../../components/Layout';
import styles from './HomePage.scss';
import { Information } from '../../components/Information';

export const HomePage = (): JSX.Element => {
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const data = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { logout } = useAuth();
    const [typeOfGame, setTypeOfGame] = useState(true);
    const [info, setInfo] = useState(false);
    const getInfo = () => setInfo(!info);
    const leftBlock = () => {
        if (user) {
            return (
                <Button href={PageLinks.profile} title={data.buttons.profile} />
            );
        }
        return null;
    };
    const authBtn = () => {
        if (user) {
            return (
                <>
                    <Button skin="quad" onClick={() => logout()} color="red">
                        <img
                            className={styles.icon}
                            src={exitIcon}
                            alt="Exit"
                        />
                    </Button>
                    <Button skin="quad" href={PageLinks.profile}>
                        <img
                            className={styles.icon}
                            src={profileIcon}
                            alt="Profile"
                        />
                    </Button>
                </>
            );
        }
        return (
            <>
                <Button skin="quad" href={PageLinks.auth}>
                    <img
                        className={styles.icon}
                        src={loginIcon}
                        alt="Profile"
                    />
                </Button>
                <Button skin="quad" href={PageLinks.register} color="green">
                    <img
                        className={styles.icon}
                        src={registrationIcon}
                        alt="Profile"
                    />
                </Button>
            </>
        );
    };

    const rightBlock = () => {
        if (user) {
            return (
                <Button
                    onClick={() => logout()}
                    skin="auth"
                    color="blue"
                    title={data.buttons.logout}
                />
            );
        }
        return (
            <>
                <Button
                    href={PageLinks.auth}
                    skin="auth"
                    noFill
                    title={data.buttons.login}
                />
                <Button
                    href={PageLinks.register}
                    color="green"
                    title={data.buttons.signup}
                />
            </>
        );
    };
    return (
        <Layout decor={false}>
            <div className={styles.home__main}>
                <img
                    className={styles['home__image-left']}
                    src={menuLogoWithShips}
                    alt="Логотип с кораблями"
                />
                <div className={styles.home__buttons}>
                    <div className={styles['home__buttons-block-left']}>
                        <Button
                            href={PageLinks.forum}
                            title={data.buttons.forum}
                        />
                        <Button
                            href={PageLinks.leaderboard}
                            title={data.buttons.leaders}
                        />
                        {leftBlock()}
                        <Button skin="quad" onClick={getInfo} title="i" />
                        <Button
                            skin="quad"
                            onClick={() => lngService.changeLng()}
                            title={data.buttons.change}
                        />
                    </div>
                    <div className={styles['home__buttons-block-right']}>
                        {rightBlock()}
                    </div>
                    <div className={styles['home__left-button-bar']}>
                        <Button
                            skin="quad"
                            onClick={() => lngService.changeLng()}
                            title={data.buttons.change}
                        />
                        <Button skin="quad" onClick={getInfo} title="i" />
                    </div>
                    <div className={styles['home__right-button-bar']}>
                        {authBtn()}
                    </div>
                </div>
                <div className={styles.home__section}>
                    <span className={styles.home__header}>BATTLESHIP</span>
                    <div className={styles.home__menu}>
                        <div className={styles.home__select}>
                            <div className={styles['home__select-tablet']}>
                                <div className={styles['home__select-label']}>
                                    <img
                                        className={styles['home__image-ship']}
                                        src={bigShip}
                                        alt="Длинный корабль"
                                    />
                                    <span
                                        className={
                                            styles['home__select-tablet_header']
                                        }
                                    >
                                        {data.text.togglemode}
                                    </span>
                                </div>
                                <div className={styles['home__select-variant']}>
                                    <p
                                        className={cn(
                                            styles[
                                            'home__select-tablet_classic'
                                            ],
                                            !typeOfGame ? styles.selected : '',
                                        )}
                                        onClick={() => {
                                            setTypeOfGame(!typeOfGame);
                                            opponentService.setOpponent(null);
                                        }}
                                    >
                                        {data.labels.classic}
                                    </p>
                                    <p
                                        className={cn(
                                            styles[
                                            'home__select-tablet_online'
                                            ],
                                            typeOfGame ? styles.selected : '',
                                        )}
                                        onClick={() => {
                                            setTypeOfGame(!typeOfGame);
                                            opponentService.setOpponent({
                                                display_name: 'test',
                                            });
                                        }}
                                    >
                                        {data.labels.online}
                                    </p>
                                </div>
                            </div>
                            <Button
                                skin="large"
                                color="green"
                                href={
                                    typeOfGame
                                        ? PageLinks.finder
                                        : `${PageLinks.game}/bot`
                                }
                                title={data.buttons.play}
                            />
                        </div>
                        <img
                            className={styles['home__image-right']}
                            src={menuLogoWithPirates}
                            alt="Логотип с пиратами"
                        />
                    </div>
                </div>
                <div className={styles['home__select-footer']}>
                    <Button
                        skin="regular"
                        href={PageLinks.leaderboard}
                        title="LEADERS"
                    />
                    <Button
                        skin="regular"
                        href={PageLinks.forum}
                        title="FORUM"
                    />
                </div>
            </div>
            {info && <Information close={getInfo} />}
        </Layout>
    );
};
