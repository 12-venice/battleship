import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';

import styles from './information.scss';

export const Information = (): JSX.Element => (
    <ModalWindow>
        <h2 className={styles.information__label}>Information</h2>
        <p className={styles.information__description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum
            dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit
            amet, consectetur adipiscing elit Lorem ipsum dolor sit amet,
            consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur
            adipiscing elit
        </p>
        <NavLink to="/">
            <Button
                className={`${styles.information__btn} ${styles.information__btn_green}`}
                title="continue"
            />
        </NavLink>
    </ModalWindow>
);
