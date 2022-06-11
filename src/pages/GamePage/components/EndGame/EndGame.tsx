import cn from 'classnames';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useEffect, useState } from 'react';
import {
    activeFieldIds,
    statisticsFields,
} from 'src/gameCore/Controller/types';
import { Props } from './types';

import styles from './EndGame.scss';
import defeatImg from '../../../../../images/defeat_img.png';
import victoryImg from '../../../../../images/victory_img.png';

export const EndGameComponent: Props = ({
    screen,
    room,
    gameAccount,
    gameStatistics,
}): JSX.Element => {
    const [hitsPercent, setHitPercent] = useState(0);
    const [shipsCount, setShipsCount] = useState(0);
    useEffect(() => {
        const playerHits =
            gameStatistics[statisticsFields.hits][activeFieldIds.player];
        const playerMiss =
            gameStatistics[statisticsFields.miss][activeFieldIds.player];
        const playerAliveShip =
            gameStatistics[statisticsFields.alive][activeFieldIds.player];
        const opponentDestroyShip =
            gameStatistics[statisticsFields.destroyed][activeFieldIds.opponent];
        const percent = Math.floor(
            (100 * playerHits) / (playerHits + playerMiss),
        );
        if (Number.isNaN(percent)) {
            setHitPercent(0);
        } else {
            setHitPercent(percent);
        }
        if (screen === 'victory') {
            setShipsCount(playerAliveShip);
        } else {
            setShipsCount(opponentDestroyShip);
        }
    }, []);
    return (
        <ModalWindow noBackground>
            <img
                className={styles.endGame__logo}
                src={screen === 'victory' ? victoryImg : defeatImg}
                alt="end game img"
            />
            <div className={styles.endGame__stats}>
                <div className={styles.endGame__score}>
                    <div className={styles.endGame__left}>
                        <span
                            className={cn(
                                styles.endGame__label,
                                styles['endGame__label-strong'],
                            )}
                        >
                            POINTS:
                        </span>
                        <span
                            className={cn(
                                styles.endGame__count,
                                styles['endGame__count-strong'],
                            )}
                        >
                            {gameAccount[activeFieldIds.player]}
                        </span>
                    </div>
                    <div className={styles.endGame__right}>
                        <div className={styles.endGame__ships}>
                            <span className={styles.endGame__label}>
                                {screen === 'victory' ? 'ALIVE:' : 'DESTROYED:'}
                            </span>
                            <span className={styles.endGame__count}>
                                {shipsCount}
                            </span>
                        </div>
                        <div className={styles.endGame__hits}>
                            <span className={styles.endGame__label}>
                                HIT RATE:
                            </span>
                            <span className={styles.endGame__count}>
                                {`${hitsPercent}%`}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.endGame__buttons}>
                    <Button
                        href={PageLinks.home}
                        skin="tiny"
                        title="PLAY"
                        color="green"
                    />
                    <Button
                        href={PageLinks.home}
                        skin="tiny"
                        title="QUIT"
                        color="yellow"
                    />
                </div>
            </div>
        </ModalWindow>
    );
};
