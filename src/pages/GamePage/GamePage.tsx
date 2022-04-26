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
import type { Props } from './components/ShipsMenu/types';
import { AREA_WIDTH, AREA_CELL_WIDTH } from './data';

import styles from './GamePage.scss';
import { mapStateToProps } from './mapState';

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

const getCurrentShips = (ships) =>
    Object.entries(ships).map(([name, { type, x, y, ky }]) => ({
        id: name,
        deckCount: type,
        x,
        y,
        isHorizontal: ky === 1,
    }));

export const GamePage = (): JSX.Element => {
    const store = useSelector(mapStateToProps);
    const playerCanvasRef = createRef<HTMLCanvasElement>();
    const botCanvasRef = createRef<HTMLCanvasElement>();
    const [playerMatrix, setPlayerMatrix] = useState();
    const [playerShips, setPlayerShips] = useState([]);
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
        () => new Placement({ field: playerCanvasRef }),
        [playerCanvasRef],
    );

    const handleClickAuto = useCallback(() => {
        playerArea.randomLocationShips();
        setPlayerMatrix(playerArea.getMatrix());
        setPlayerShips(getCurrentShips(playerArea.getSquadron()));
    }, []);

    const handleClickReset = useCallback(() => {
        playerArea.cleanField();
        setPlayerMatrix(playerArea.getMatrix());
        setPlayerShips(getCurrentShips(playerArea.getSquadron()));
    }, []);

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
                    <Area
                        ref={playerCanvasRef}
                        areaWidth={AREA_WIDTH}
                        matrix={playerMatrix}
                        ships={playerShips}
                    />
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
                            ships={data.ships}
                            onDragStart={placement.handlerShipDragStart}
                            onDrop={placement.handlerShipDragEnd}
                            onDragOver={placement.handlerShipOver}
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
