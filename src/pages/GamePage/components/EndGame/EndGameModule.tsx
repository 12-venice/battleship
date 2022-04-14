import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { Props } from './types';

import styles from './EndGameModule.scss';
import defeatImg from '../../../../../images/defeat_img.png';
import victoryImg from '../../../../../images/victory_img.png';

export const EndGameComponent: Props = ({ screen }): JSX.Element => (
    <ModalWindow noBackground>
        <img
            className={styles.endGame__logo}
            src={screen === 'victory' ? victoryImg : defeatImg}
            alt="end game img"
        />
        <div className={styles.endGame__buttons}>
            <NavLink to="/">
                <Button skin="high" title="PLAY" color="green" />
            </NavLink>
            <NavLink to="/">
                <Button skin="high" title="QUIT" color="yellow" />
            </NavLink>
        </div>
    </ModalWindow>
);
