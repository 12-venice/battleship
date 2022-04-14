import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { PageLinks } from '../utils/Routes/types';

import styles from './information.scss';

import { Props } from './types';

export const Information: Props = ({ close }): JSX.Element => (
    <ModalWindow>
        <h2 className={styles.information__label}>Information</h2>
        <p className={styles.information__description}>
            Это информация о нашей игре. Это информация о нашей игре. Это
            информация о нашей игре. Это информация о нашей игре. Это информация
            о нашей игре. Это информация о нашей игре. Это информация о нашей
            игре. Это информация о нашей игре. Это информация о нашей игре. Это
            информация о нашей игре. Это информация о нашей игре. Это информация
            о нашей игре. Это информация о нашей игре. Это информация о нашей
            игре.
        </p>
        <Button skin="high" color="green" title="BACK" onClick={close} />
    </ModalWindow>
);
