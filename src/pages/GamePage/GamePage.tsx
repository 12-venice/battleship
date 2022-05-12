import { createRef, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { Information } from 'src/components/Information';
import { Layout } from 'src/components/Layout';
import { Controller } from 'src/gameCore/Controller';
import { Placement } from 'src/gameCore/Placement';
import { AllStateTypes } from 'src/store/reducers';
import { FullScreenView } from 'src/components/api/Fullscreen/FullScreenView';
import { MatrixCell } from 'src/gameCore/types';
import { Area } from './components/Area';
import { PlayerName } from './components/PlayerName';
import { ShipsMenu } from './components/ShipsMenu';
import { AREA_WIDTH, AREA_CELL_WIDTH } from './data';
import styles from './GamePage.scss';
import { mapStateToProps } from './mapState';

export const GamePage = (): JSX.Element => {
    const store = useSelector(mapStateToProps);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const playerCanvasRef = createRef<HTMLCanvasElement>();
    const botCanvasRef = createRef<HTMLCanvasElement>();
    const [gameStep, setGameStep] = useState(0);
    const [info, setInfo] = useState(false);
    const [playerField, setPlayerField] = useState();
    const [opponentField, setOpponentField] = useState();
    const [info, setInfo] = useState(false);
    const [playerMatrix, setPlayerMatrix] = useState();
    const [playerSquadron, setPlayerSquadron] = useState();
    const getInfo = () => setInfo(!info);

    const handlerChangePlayerField = useCallback(({ matrix, squadron }) => {
        const ships = Object.entries(squadron).map(
            ([shipName, { arrDecks, x, y, kx }]) => ({
                id: shipName,
                deckCount: arrDecks.length,
                x,
                y,
                isHorizontal: !kx,
            }),
        );
        // debugger
        setPlayerField({ matrix, ships });
    }, []);

    const handlerChangeOpponentField = useCallback(
({ matrix, squadron }) => {
        const currentMatrix = matrix.map(
            (row) => row.map(
                (cell) => (cell === MatrixCell.deck ? MatrixCell.empty : cell)
            )
        );
        setOpponentField({ matrix: currentMatrix, ships: {} });
    },
    []
);

    const placementArea = useMemo(
        () => new Placement({ field: playerCanvasRef }),
        [playerCanvasRef],
    );

    const gameController = useMemo(() => {
        if (gameStep === 1) {
            // debugger
            return new Controller({
                opponentFieldRef: botCanvasRef,
                playerSquadron,
                playerMatrix,
                handlerChangePlayerField,
                handlerChangeOpponentField,
            });
        }
        return null;
    }, [gameStep, handlerChangePlayerField, handlerChangeOpponentField]);

    const handlerPlayerShot = useCallback(
        (event) => {
            if (gameController?.handlerPlayerShot) {
                gameController.handlerPlayerShot(event);
            }
        },
        [gameController],
    );

    const handlerBotShot = useCallback(
        (event) => {
            if (gameController?.handlerOpponentShot) {
                gameController.handlerOpponentShot(event);
            }
        },
        [gameController],
    );

    const handleClickAuto = useCallback(() => {
        placementArea.randomLocationShips();
    }, [placementArea]);

    const handleClickReset = useCallback(() => {
        placementArea.resetLocationShips();
    }, [placementArea]);

    const handleGameStart = useCallback(() => {
        setPlayerMatrix(placementArea.getMatrix());
        setPlayerSquadron(placementArea.getSquadron());
        setGameStep(1);
    }, [placementArea]);

    return (
        <Layout>
            <div className={styles.game__background}>
                <FullScreenView>
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
                            onClick={handlerBotShot}
                            {...playerField}
                        />
                        <Area
                            ref={botCanvasRef}
                            areaWidth={AREA_WIDTH}
                            fillColor="#9DC0F0"
                            onClick={handlerPlayerShot}
                            {...opponentField}
                        />
                    </div>
                    <div className={styles.game__footer}>
                        {gameStep === 0 && (
                            <>
                                <div className={styles.game__docs}>
                                    <ShipsMenu
                                        imgWidth={AREA_CELL_WIDTH}
                                        onDragStart={placementArea.handlerShipDragStart}
                                        onDrop={placementArea.handlerShipDragEnd}
                                        onDragOver={placementArea.handlerShipOver}
                                        onContextMenu={placementArea.rotationShip}
                                    />
                                </div>
                                <div className={styles['game__footer-buttons']}>
                                    <div
                                        className={
                                            styles['game__footer-buttons_controls']
                                        }
                                    >
                                        <Button
                                            href="/"
                                            skin="short"
                                            title={dataStore.buttons.auto}
                                            onClick={handleClickAuto}
                                        />
                                        <Button
                                        href="/"
                                        skin="short"
                                            title={dataStore.buttons.reset}
                                        onClick={handleClickReset}
                                        />
                                    </div>
                                    <div className={styles['game__footer-ships-btn']}>
                                    <Button
                                            href="/"
                                            skin="regular"
                                            title={dataStore.buttons.ships}
                                        />
                                </div>
                                    <Button
                                    href="/"
                                    skin="high"
                                    title={dataStore.buttons.start}
                                        color="green"
                                    onClick={handleGameStart}
                                />
                                </div>
                            </>
                        )}
                    </div>
                </FullScreenView>
            </div>
            {info && <Information close={getInfo} />}
        </Layout>
    );
};
