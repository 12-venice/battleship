// @ts-nocheck
import { activeFieldIds } from 'src/gameCore/Controller/types';
import styles from './Statistics.scss';

import { Props } from './types';

export const Statistics: Props = ({ statistics }): JSX.Element => (
    <div className={styles.game__statistics}>
        {statistics.map((el) => (
            <div key={el.label}>
                <h5 className={styles['game__statistics-label']}>{el.label}</h5>
                <span className={styles['game__statistics-description']}>
                    {`${el[activeFieldIds.player]}/${
                        el[activeFieldIds.opponent]
                    }`}
                </span>
            </div>
        ))}
    </div>
);
