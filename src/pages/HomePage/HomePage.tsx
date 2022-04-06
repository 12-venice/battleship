import { Button } from 'src/components/Button';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.svg';
import { Layout } from '../../components/Layout';

export const HomePage = (): JSX.Element => {
    const [typeOfGame, setTypeOfGame] = useState(false);

    return (
        <Layout>
            <div className="home__main">
                <div className="home__buttons">
                    <NavLink to="/">
                        <Button title="forum" />
                    </NavLink>
                    <NavLink to="/">
                        <Button title="leaders" />
                    </NavLink>
                    <NavLink to="/profile">
                        <Button title="profile" />
                    </NavLink>
                    <NavLink to="/auth">
                        <Button className="red" title="x" />
                    </NavLink>
                </div>
                <img
                    className="home__image-left"
                    src={menuLogoWithShips}
                    alt="Логотип с кораблями"
                />
                <span className="home__header">BATTLESHIP</span>
                <div className="home__menu">
                    <div className="home__select">
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
                                    <span className="home__select-toggle-logotype">
                                        Toggle play mode!
                                    </span>
                                </label>
                            </div>
                            <div className="home__select-type">
                                <span
                                    className={`home__select-type-logotype ${
                                        !typeOfGame ? 'selected' : ''
                                    }`}
                                >
                                    CLASSIC
                                </span>
                                <span
                                    className={`home__select-type-logotype ${
                                        typeOfGame ? 'selected' : ''
                                    }`}
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
                        className="home__image-right"
                        src={menuLogoWithPirates}
                        alt="Логотип с пиратами"
                    />
                </div>
            </div>
        </Layout>
    );
};
