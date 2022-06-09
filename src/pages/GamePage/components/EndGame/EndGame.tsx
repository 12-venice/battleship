import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Props } from './types';

import styles from './EndGame.scss';
import defeatImg from '../../../../../images/defeat_img.png';
import victoryImg from '../../../../../images/victory_img.png';

export const EndGameComponent: Props = ({ screen, room }): JSX.Element => (
    <ModalWindow noBackground>
        <img
            className={styles.endGame__logo}
            src={screen === 'victory' ? victoryImg : defeatImg}
            alt="end game img"
        />
        <div className={styles.endGame__buttons}>
            <Button
                href={PageLinks.home}
                skin="high"
                title="PLAY"
                color="green"
            />
            <Button
                href={PageLinks.home}
                skin="high"
                title="QUIT"
                color="yellow"
            />
        </div>
    </ModalWindow>
);
