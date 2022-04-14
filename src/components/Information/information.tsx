import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import styles from './information.scss';
import { Props } from './types';

const info = `"BATTLESHIP" is a game for two participants in which players take
turns calling coordinates on an unknown opponent's map. If the
opponent has a ship at these coordinates (the coordinates are
occupied), then the ship or part of it is "drowned", and the hit
gets the right to make another move. The player's goal is to sink
all enemy ships first.`;

export const Information: Props = ({ close }): JSX.Element => (
    <ModalWindow>
        <h2 className={styles.information__label}>Information</h2>
        <p className={styles.information__description}>{info}</p>
        <Button skin="high" color="green" title="BACK" onClick={close} />
    </ModalWindow>
);
