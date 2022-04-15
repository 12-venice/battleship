import { Button } from 'src/components/Button';
import { Layout } from 'src/components/Layout';
import { Area } from './components/Area';
import { ShipsMenu } from './components/ShipsMenu';
import type { Props } from './components/ShipsMenu/types';

import styles from './GamePage.scss';

const data: Props = {
    ships: [
        { id: '1', type: 4, visible: true },
        { id: '5', type: 3, visible: true },
        { id: '6', type: 3, visible: true },
        { id: '7', type: 2, visible: true },
        { id: '2', type: 2, visible: true },
        { id: '8', type: 2, visible: true },
        { id: '9', type: 1, visible: true },
        { id: '3', type: 1, visible: true },
        { id: '10', type: 1, visible: true },
        { id: '4', type: 1, visible: true },
    ],
};

export const GamePage = (): JSX.Element => (
    <Layout>
        <div className={styles.game__background}>
            <div className={styles.game__header}>
                <Button href="/" skin="quad" title="i" />
                <p className={styles['game__header-text']}>VS</p>
                <Button href="/" skin="quad" title="X" color="red" />
            </div>
            <div className={styles.game__battlefields}>
                <Area areaWidth={425} />
                <Area areaWidth={425} fillColor="#9DC0F0" />
            </div>
            <div className={styles.game__footer}>
                <div className={styles.game__docs}>
                    <ShipsMenu ships={data.ships} />
                </div>
                <div className={styles['game__footer-buttons']}>
                    <div>
                        <Button href="/" skin="short" title="AUTO" />
                        <Button href="/" skin="short" title="RESET" />
                    </div>
                    <Button href="/" skin="high" title="START" color="green" />
                </div>
            </div>
        </div>
    </Layout>
);
