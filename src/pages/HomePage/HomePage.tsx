import { Button } from 'src/components/Button';
import { NavLink } from 'react-router-dom';
import menuLogoWithShips from '../../../images/menuLogoWithShips.svg';
import menuLogoWithPirates from '../../../images/menuLogoWithPirates.svg';
import { Layout } from '../../components/Layout';

export const HomePage = (): JSX.Element => (
    <Layout>
        <div className="main">
            <img
                className="image__left"
                src={menuLogoWithShips}
                alt="Логотип с кораблями"
            />
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
                </div>
                <span className="block__header">BATTLESHIP</span>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="block__select">
                        <input />
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
        </div>
    </Layout>
);
