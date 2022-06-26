// @ts-nocheck
import { ModalWindow } from 'src/components/ModalWindow';
import { Preloader } from 'src/components/Preloader';

import styles from './Waiting.scss';

export const Waiting = (): JSX.Element => (
    <ModalWindow>
        <p className={styles.waiting__text}>Waiting for your opponent</p>
        <Preloader />
    </ModalWindow>
);
