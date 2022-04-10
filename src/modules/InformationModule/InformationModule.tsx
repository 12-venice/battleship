import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';

import styles from './InformationModule.scss';

export const InformationModule = (): JSX.Element => {
    return (
        <div className={styles.bg}>
            <div className={styles.plate}>
                <h2 className={styles.label}>Information</h2>
                <p className={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
                <NavLink to="/">
                    <Button className={`${styles.btn} ${styles.btn_green}`} title="continue" />
                </NavLink>
            </div>
        </div>
    );
};
