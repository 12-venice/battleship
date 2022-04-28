import { createRef, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { Information } from 'src/components/Information';
import { Layout } from 'src/components/Layout';
import { Field } from 'src/gameCore/Field';
import { Placement } from 'src/gameCore/Placement';
import { Area } from './components/Area';
import { PlayerName } from './components/PlayerName';
import { ShipsMenu } from './components/ShipsMenu';
import { AREA_WIDTH, AREA_CELL_WIDTH } from './data';

import styles from './GamePage.scss';
import { mapStateToProps } from './mapState';

export const GamePage = (): JSX.Element => {
    const store = useSelector(mapStateToProps);
    const playerCanvasRef = createRef<HTMLCanvasElement>();
    const botCanvasRef = createRef<HTMLCanvasElement>();
    const [info, setInfo] = useState(false);
    const getInfo = () => setInfo(!info);

    const playerArea = useMemo(
        () =>
            new Field({
                isPlayer: true,
            }),
        [],
    );

    const placement = useMemo(
        () => new Placement({ field: playerCanvasRef, self: playerArea }),
        [playerCanvasRef, playerArea],
    );

    const handleClickAuto = useCallback(() => {
        placement.randomLocationShips();
    }, [placement]);

    const handleClickReset = useCallback(() => {
        placement.resetLocationShips();
    }, [placement]);

    return (
        <Layout>
            <div className={styles.game__background}>
                <div className={styles.game__header}>
                    <Button skin="quad" title="i" onClick={getInfo} />
                    <PlayerName
                        name={store.display_name ?? 'Player 1'}
                        avatarPosition="right"
                    />
                    <p className={styles['game__header-text']}>VS</p>
                    <PlayerName name="Player 2" />
                    <Button href="/" skin="quad" title="X" color="red" />
                </div>
                <div className={styles.game__battlefields}>
                    <Area ref={playerCanvasRef} areaWidth={AREA_WIDTH} />
                    <Area
                        ref={botCanvasRef}
                        areaWidth={AREA_WIDTH}
                        fillColor="#9DC0F0"
                    />
                </div>
                <div className={styles.game__footer}>
                    <div className={styles.game__docs}>
                        <ShipsMenu
                            imgWidth={AREA_CELL_WIDTH}
                            onDragStart={placement.handlerShipDragStart}
                            onDrop={placement.handlerShipDragEnd}
                            onDragOver={placement.handlerShipOver}
                            onContextMenu={placement.rotationShip}
                        />
                    </div>
                    <div className={styles['game__footer-buttons']}>
                        <div>
                            <Button
                                href="/"
                                skin="short"
                                title="AUTO"
                                onClick={handleClickAuto}
                            />
                            <Button
                                href="/"
                                skin="short"
                                title="RESET"
                                onClick={handleClickReset}
                            />
                        </div>
                        <Button
                            href="/"
                            skin="high"
                            title="START"
                            color="green"
                        />
                    </div>
                </div>
            </div>
            {info && <Information close={getInfo} />}
        </Layout>
    );
};
