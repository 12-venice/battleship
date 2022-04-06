import cn from 'classnames';
import { Button } from 'src/components/Button';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.svg';
import { Layout } from '../../components/Layout';
import styles from './HomePage.scss';

export const HomePage = (): JSX.Element => {
    const [typeOfGame, setTypeOfGame] = useState(false);

    return (
        <Layout>
            <div className={styles.block__main}>
                <div className={styles.block__buttons}>
                    <NavLink to="/">
                        <Button title="forum" />
                    </NavLink>
                    <NavLink to="/">
                        <Button title="leaders" />
                    </NavLink>
                    <NavLink to="/">
                        <Button title="profile" />
                    </NavLink>
                    <NavLink to="/auth">
                        <Button className="red" title="x" />
                    </NavLink>
                </div>
                <img
                    className={styles.image__left}
                    src={menuLogoWithShips}
                    alt="Логотип с кораблями"
                />
                <span className={styles.block__header}>BATTLESHIP</span>
                <div className={styles.block__menu}>
                    <div className={styles.block__select}>
                        <div>
                            <div>
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
                                                'block__select-toggle-logotype'
                                            ]
                                        }
                                    >
                                        Toggle play mode!
                                    </span>
                                </label>
                            </div>
                            <div className="block__select-type">
                                <span
                                    className={cn(
                                        styles['block__select-type-logotype'],
                                        { selected: !typeOfGame },
                                    )}
                                >
                                    CLASSIC
                                </span>
                                <span
                                    className={cn(
                                        styles['block__select-type-logotype'],
                                        { selected: !typeOfGame },
                                    )}
                                >
                                    ONLINE
                                </span>
                            </div>
                        </div>
                        <NavLink to="/auth">
                            <Button className="green big" title="play" />
                        </NavLink>
                    </div>
                    <img
                        className={styles.image__right}
                        src={menuLogoWithPirates}
                        alt="Логотип с пиратами"
                    />
                </div>
            </div>
        </Layout>
    );
};
