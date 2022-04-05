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
            <div className="block__main">
                <div className="block__buttons">
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
                    className="image__left"
                    src={menuLogoWithShips}
                    alt="Логотип с кораблями"
                />
                <span className="block__header">BATTLESHIP</span>
                <div className="block__menu">
                    <div className="block__select">
                        <div>
                            <div className="switch">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={typeOfGame}
                                        onChange={() => {
                                            setTypeOfGame(!typeOfGame);
                                        }}
                                    />
                                    <span className="lever" />
                                    <span className="block__select-toggle-logotype">
                                        Toggle play mode!
                                    </span>
                                </label>
                            </div>
                            <div className="block__select-type">
                                <span
                                    className={`block__select-type-logotype ${
                                        !typeOfGame ? 'selected' : ''
                                    }`}
                                >
                                    CLASSIC
                                </span>
                                <span
                                    className={`block__select-type-logotype ${
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
                        className="image__right"
                        src={menuLogoWithPirates}
                        alt="Логотип с пиратами"
                    />
                </div>
            </div>
        </Layout>
    );
};
