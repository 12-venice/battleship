import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { Props } from './types';

import styles from './EndGameModule.scss';
import defeat_img from '../../../images/defeat_img.png';
import victory_img from '../../../images/victory_img.png';

export const EndGameModule:Props = (props): JSX.Element => {
    return (
        <div className={styles.bg}>
            <div className={styles.defeat_bg} style={{
                backgroundImage: `url(${props.screen === 'victory' ? victory_img : defeat_img})`,
                width: '712px',
                height: '867px',
                display: 'block',
                margin: '0 auto'
            }}>
                <div className={styles.buttons}>
                    <NavLink to="/startgame">
                        <Button className={`${styles.btn} ${styles.btn_green}`} title="play" />
                    </NavLink>
                    <NavLink to="/">
                        <Button className={`${styles.btn} ${styles.btn_yellow}`} title="quit" callback={props.callback} />
                    </NavLink>
                </div>
            </div>
        </div>
    );
};