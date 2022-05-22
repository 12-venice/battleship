import cn from 'classnames';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { useState } from 'react';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useAuth } from 'src/hooks/auth.hook';
import { AllStateTypes } from 'src/store/reducers';
import { lngService } from 'src/store/services/lngService';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.png';
import menuLogoWithHighPirate from '../../../images/menuLogoWithHighPirate.svg';
import { Layout } from '../../components/Layout';
import styles from './HomePage.scss';
import { Information } from '../../components/Information';
import { DropMenu } from './components/dropMenu';

export const HomePage = (): JSX.Element => {
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const data = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { logout } = useAuth();
    const [typeOfGame, setTypeOfGame] = useState(true);
    const [info, setInfo] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const getInfo = () => setInfo(!info);
    const getMenu = () => setDropDown(!dropDown);
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
                <Button skin="quad" onClick={logout}>
                    <i className="small material-icons">exit_to_app</i>
                </Button>
            );
        }
        return (
            <Button skin="quad" href={PageLinks.auth}>
                <i className="small material-icons">lock</i>
            </Button>
        );
    };

    const rightBlock = () => {
        if (user) {
            return (
                <Button
                    onClick={logout}
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
        <Layout>
            <div className={styles.home__main}>
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
                </div>
                <img
                    className={styles['home__image-left']}
                    src={menuLogoWithShips}
                    alt="Логотип с кораблями"
                />
                <span className={styles.home__header}>BATTLESHIP</span>
                <div className={styles.home__menu}>
                    <img
                        className={styles['home__image-high-pirate']}
                        src={menuLogoWithHighPirate}
                        alt="Высокий пират"
                    />
                    <div className={styles.home__select}>
                        <div className={styles['home__select-lever']}>
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
                                        {data.text.togglemode}
                                    </span>
                                </label>
                            </div>
                            <div className="home__select-type">
                                <span
                                    aria-hidden
                                    onClick={() => setTypeOfGame(false)}
                                    className={cn(
                                        styles['home__select-type-logotype'],
                                        !typeOfGame ? styles.selected : '',
                                    )}
                                >
                                    {data.labels.classic}
                                </span>
                                <span
                                    aria-hidden
                                    onClick={() => setTypeOfGame(true)}
                                    className={cn(
                                        styles['home__select-type-logotype'],
                                        typeOfGame ? styles.selected : '',
                                    )}
                                >
                                    {data.labels.online}
                                </span>
                            </div>
                        </div>
                        <div className={styles['home__select-tablet']}>
                            <span
                                className={styles['home__select-tablet_header']}
                            >
                                Toggle play mode!
                            </span>
                            <p
                                aria-hidden
                                onClick={() => setTypeOfGame(false)}
                                className={cn(
                                    styles['home__select-tablet_classic'],
                                    typeOfGame ? styles.selected : '',
                                )}
                            >
                                {data.labels.classic}
                            </p>
                            <p
                                aria-hidden
                                onClick={() => setTypeOfGame(true)}
                                className={cn(
                                    styles['home__select-tablet_online'],
                                    typeOfGame ? styles.selected : '',
                                )}
                            >
                                {data.labels.online}
                            </p>
                        </div>
                        <Button
                            skin={window.innerWidth < 450 ? 'regular' : 'large'}
                            color="green"
                            href={
                                typeOfGame ? PageLinks.finder : PageLinks.game
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
                    <Button skin="quad" onClick={getMenu}>
                        <i className="small material-icons">menu</i>
                    </Button>
                </div>
            </div>
            <div className={styles.home__circle}> </div>
            {info && <Information close={getInfo} />}
            {dropDown && (
                <DropMenu close={getMenu}>
                    <Button href={PageLinks.forum} title={data.buttons.forum} />
                    <Button
                        href={PageLinks.leaderboard}
                        title={data.buttons.leaders}
                    />
                    {leftBlock()}
                </DropMenu>
            )}
        </Layout>
    );
};
