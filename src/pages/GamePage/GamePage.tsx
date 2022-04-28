import { useSelector } from 'react-redux';
import { createRef, useState, useCallback, useMemo } from 'react';
import { Button } from 'src/components/Button';
import { Information } from 'src/components/Information';
import { Layout } from 'src/components/Layout';
import { Field } from 'src/gameCore/Field';
import { AllStateTypes } from 'src/store/reducers';
import { FullScreenView } from 'src/components/api/Fullscreen/FullScreenView';
import { Area } from './components/Area';
import { PlayerName } from './components/PlayerName';
import { ShipsMenu } from './components/ShipsMenu';
import type { Props } from './components/ShipsMenu/types';

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
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
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

    const handleClickAuto = useCallback(() => {
        playerArea.randomLocationShips();
        setPlayerMatrix(playerArea.getMatrix());
        setPlayerShips(getCurrentShips(playerArea.getSquadron()));
    }, [playerArea]);

    const handleClickReset = useCallback(() => {
        playerArea.cleanField();
        setPlayerMatrix(playerArea.getMatrix());
        setPlayerShips(getCurrentShips(playerArea.getSquadron()));
    }, [playerArea]);

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
                            canvasRef={playerCanvasRef}
                            areaWidth={425}
                            matrix={playerMatrix}
                            ships={playerShips}
                        />
                        <Area
                            canvasRef={botCanvasRef}
                            areaWidth={425}
                            fillColor="#9DC0F0"
                        />
                    </div>
                    <div className={styles.game__footer}>
                        <div className={styles.game__docs}>
                            <ShipsMenu ships={data.ships} />
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
                            />
                        </div>
                    </div>
                </FullScreenView>
            </div>
            {info && <Information close={getInfo} />}
        </Layout>
    );
};
