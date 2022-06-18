/* eslint-disable @typescript-eslint/ban-types */
import { config } from './config';
import styles from './Emoji.scss';

export const Emoji = ({ callback }: { callback: Function }) => (
    <div className={styles.emoji__background}>
        <div className={styles.emoji__block}>
            {config.map((element) => (
                <div
                    aria-hidden
                    className={styles.emoji__cell}
                    key={element.unicode}
                    onClick={() => callback(element.unicode)}
                >
                    {element.unicode}
                </div>
            ))}
        </div>
    </div>
);
