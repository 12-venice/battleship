import cn from 'classnames';
import { createRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { Information } from 'src/components/Information';
import { Layout } from 'src/components/Layout';
import { Placement } from 'src/gameCore/Placement';
import { AllStateTypes } from 'src/store/reducers';
import { FullScreenView } from 'src/components/api/Fullscreen/FullScreenView';
import e from 'express';
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
    const [info, setInfo] = useState(false);
    const getInfo = () => setInfo(!info);

    const [test, setTest] = useState(false);

    const placementArea = useMemo(
        () => new Placement({ field: playerCanvasRef }),
        [playerCanvasRef],
    );

    const handleClickAuto = useCallback(() => {
        placementArea.randomLocationShips();
    }, [placementArea]);

    const handleClickReset = useCallback(() => {
        placementArea.resetLocationShips();
    }, [placementArea]);

    const [areaWidthSize, setareaWidthSize] = useState(
        window.screen.availWidth < 480 ? window.screen.availWidth * 0.8 : 425,
    );
    useEffect(() => {
        function winResize() {
            const width = window.screen.availWidth;
            if (width < 480) setareaWidthSize(width * 0.8);
        }
        window.addEventListener('resize', winResize);
        return () => window.removeEventListener('resize', winResize);
    }, []);

    const [trnslX, setTrnslX] = useState(true);
    const sliderRef = createRef<HTMLDivElement>();
    useEffect(() => {
        let tuchX = 0;
        let delt = false;
        const tStart = (e) => {
            tuchX = e.changedTouches[0].clientX;
            console.log('start');
        };
        const tEnd = (e) => {
            console.log('end');
            if (Math.abs(tuchX - e.changedTouches[0].clientX) > 40) {
                delt = !delt;
                setTrnslX(!delt);
            }
        };
        if (sliderRef.current) {
            sliderRef.current.addEventListener('touchstart', tStart);
            sliderRef.current.addEventListener('touchend', tEnd);
        }
    }, []);

    const video = createRef<HTMLDivElement>();
    useEffect(() => {
        let timer;
        const onlongtouch = function () {
            console.log('1s');
            setTrnslX(false);
        };
        function touchstart() {
            timer = setTimeout(onlongtouch, 1000);
        }

        function touchend() {
            if (timer) {
                clearTimeout(timer);
            }
        }

        if (video.current) {
            video.current.addEventListener('touchstart', touchstart);
            video.current.addEventListener('touchend', touchend);
        }
    }, []);
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
                    <div className={styles.container}>
                        <div
                            className={cn(
                                styles.slider,
                                trnslX ? styles.right : styles.left,
                            )}
                            ref={sliderRef}
                        >
                            <div>
                                <div
                                    className={cn(
                                        styles.disabled,
                                        test ? styles.active : '',
                                    )}
                                >
                                    {/* <Area
                                        canvasRef={botCanvasRef}
                                        areaWidth={areaWidthSize}
                                    /> */}
                                    <Area
                                        ref={botCanvasRef}
                                        areaWidth={areaWidthSize}
                                        fillColor="#9DC0F0"
                                    />
                                </div>
                                <div
                                    className={cn(
                                        styles.disabled,
                                        test ? '' : styles.active,
                                    )}
                                >
                                    {/* <Area
                                        canvasRef={playerCanvasRef}
                                        areaWidth={areaWidthSize}
                                        matrix={playerMatrix}
                                        ships={playerShips}
                                        fillColor="#C1DBFF"
                                    /> */}
                                    <Area
                                        ref={playerCanvasRef}
                                        areaWidth={areaWidthSize}
                                    />
                                </div>
                            </div>
                            <div className={styles.game__statistics}>
                                <div>
                                    <h5
                                        className={
                                            styles['game__statistics-label']
                                        }
                                    >
                                        HITS
                                    </h5>
                                    <span
                                        className={
                                            styles[
                                                'game__statistics-description'
                                            ]
                                        }
                                    >
                                        8 / 17
                                    </span>
                                </div>
                                <div>
                                    <h5
                                        className={
                                            styles['game__statistics-label']
                                        }
                                    >
                                        MISS
                                    </h5>
                                    <span
                                        className={
                                            styles[
                                                'game__statistics-description'
                                            ]
                                        }
                                    >
                                        17 / 3
                                    </span>
                                </div>
                                <div>
                                    <h5
                                        className={
                                            styles['game__statistics-label']
                                        }
                                    >
                                        ALIVE
                                    </h5>
                                    <span
                                        className={
                                            styles[
                                                'game__statistics-description'
                                            ]
                                        }
                                    >
                                        3 / 8
                                    </span>
                                </div>
                                <div>
                                    <h5
                                        className={
                                            styles['game__statistics-label']
                                        }
                                    >
                                        DESTROYED
                                    </h5>
                                    <span
                                        className={
                                            styles[
                                                'game__statistics-description'
                                            ]
                                        }
                                    >
                                        2 / 7
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={cn(
                            styles.game__docs,
                            test ? styles.disabled : '',
                        )}
                    >
                        <ShipsMenu
                            imgWidth={AREA_CELL_WIDTH}
                            onDragStart={placementArea.handlerShipDragStart}
                            onDrop={placementArea.handlerShipDragEnd}
                            onDragOver={placementArea.handlerShipOver}
                            onContextMenu={placementArea.rotationShip}
                        />
                    </div>
                    <div className={styles.wrapper}>
                        <div
                            className={cn(
                                styles.test,
                                test ? styles.active : '',
                            )}
                        >
                            <p>test</p>
                        </div>
                    </div>
                    <div className={styles.game__footer}>
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
                                    skin="quad"
                                    onClick={handleClickReset}
                                >
                                    <i className="small material-icons">
                                        replay
                                    </i>
                                </Button>
                                <div ref={video}>
                                    <Button
                                        skin="high"
                                        title={dataStore.buttons.start}
                                        color="green"
                                        onClick={() => setTest(!test)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </FullScreenView>
            </div>
            {info && <Information close={getInfo} />}
        </Layout>
    );
};
