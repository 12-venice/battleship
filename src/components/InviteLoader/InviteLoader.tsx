import { ModalWindow } from 'src/components/ModalWindow';
import { Preloader } from '../Preloader';

import styles from './InviteLoader.scss';

import { Props } from './types';

export const InviteLoader: Props = ({ user }): JSX.Element => (
    <ModalWindow>
        <span className={styles.loader__text}>Inviting...</span>
        <Preloader />
        <span className={styles.loader__text}>{user.display_name}</span>
    </ModalWindow>
);
