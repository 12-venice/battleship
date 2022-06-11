import cn from 'classnames';
import { createRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Layout } from 'src/components/Layout';
import { Controller } from 'src/gameCore/Controller';
import { Placement } from 'src/gameCore/Placement';
import { AllStateTypes } from 'src/store/reducers';
import { FullScreenView } from 'src/components/api/Fullscreen/FullScreenView';
import { MatrixCell } from 'src/gameCore/types';
import { useParams } from 'react-router-dom';
import { useHttp } from 'src/hooks/http.hook';
import { User } from 'src/store/reducers/user';
import { Button } from 'src/components/Button';
import { activeFieldIds } from 'src/gameCore/Controller/types';
import { Area } from './components/Area';
import { ShipsMenu } from './components/ShipsMenu';
import styles from './GamePage.scss';
import { Chat } from './components/Chat';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EndGameComponent } from './components/EndGame';
import { Statistics } from './components/Statistics';

export const GamePage = (): JSX.Element => {
    const { request } = useHttp();
    const { room } = useParams() as { room: string };
    const thisUser = useSelector((state: AllStateTypes) => state.user.item);

    const [anotherUser, setAnotherUser] = useState();
    const [gameStep, setGameStep] = useState(0);
    const [playerField, setPlayerField] = useState();
    const [opponentField, setOpponentField] = useState();
    const [playerMatrix, setPlayerMatrix] = useState();
    const [playerSquadron, setPlayerSquadron] = useState();
    const [startGame, setStartGame] = useState(false);
    const [videoCall, setVideoCall] = useState(false);
    const [trnslX, setTrnslX] = useState(true);
    const [isFull, setIsFull] = useState(false);
    const [fieldIs, setField] = useState(true);
    const [gameOver, setGameOver] = useState(null);
    const [gameStatistics, setGameStatistics] = useState([]);
    const [timerDisplay, setTimerDisplay] = useState(true);
    const [timerOver, setTimerOver] = useState(false);

    const sliderRef = createRef<HTMLDivElement>();
    // const video = createRef<HTMLDivElement>();
    const playerCanvasRef = createRef<HTMLCanvasElement>();
    const botCanvasRef = createRef<HTMLCanvasElement>();

    const getRoom = useCallback(async () => {
        const data = await request(`/api/room/${room}`, 'GET', null);
        setAnotherUser(
            data.users.find((user: User) => user._id !== thisUser?._id),
        );
    }, [request, room, thisUser?._id]);

    const handlerGameOver = useCallback((winner) => {
        if (winner === activeFieldIds.opponent) {
            setGameOver('defeat');
        } else {
            setGameOver('victory');
        }
    }, []);

    const handlerChangePlayerField = useCallback(({ matrix, squadron }) => {
        const ships = Object.entries(squadron).map(
            ([shipName, { arrDecks, x, y, kx, hits }]) => ({
                id: shipName,
                deckCount: arrDecks.length,
                x,
                y,
                isHorizontal: !kx,
                isRip: hits === arrDecks.length,
            }),
        );
        setPlayerField({ matrix, ships });
    }, []);

    const handlerChangeOpponentField = useCallback(({ matrix, squadron }) => {
        const currentMatrix = matrix.map((row) =>
            row.map((cell) =>
                (cell === MatrixCell.deck ? MatrixCell.empty : cell),),);

        const ships = Object.entries(squadron)
            .filter(([, { arrDecks, hits }]) => hits === arrDecks.length)
            .map(([shipName, { arrDecks, x, y, kx, hits }]) => ({
                id: shipName,
                deckCount: arrDecks.length,
                x,
                y,
                isHorizontal: !kx,
                isRip: hits === arrDecks.length,
            }));

        setOpponentField({ matrix: currentMatrix, ships });
    }, []);
    const placementArea = useMemo(
        () => new Placement({ field: playerCanvasRef }),
        [playerCanvasRef],
    );

    const gameController = useMemo(() => {
        if (gameStep === 1) {
            return new Controller({
                opponentFieldRef: botCanvasRef,
                playerSquadron,
                playerMatrix,
                handlerChangePlayerField,
                handlerChangeOpponentField,
                handlerGameOver,
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

    const startAreaWidth = useCallback(() => {
        if (window.innerWidth < 480) {
            return window.innerWidth * 0.8;
        }
        if (window.innerWidth >= 480 && window.innerWidth <= 800) {
            return 380;
        }
        if (window.innerWidth > 800 && window.innerWidth < 1500) {
            return window.innerWidth * 0.25;
        }
        return 380;
    }, []);

    useEffect(() => {
        let tuchX = 0;
        let delt = false;
        const tStart = (e: TouchEvent) => {
            tuchX = e.changedTouches[0].clientX;
        };
        const tEnd = (e: TouchEvent) => {
            if (Math.abs(tuchX - e.changedTouches[0].clientX) > 40) {
                delt = !delt;
                setTrnslX(!delt);
            }
        };
        if (sliderRef.current) {
            sliderRef.current.addEventListener('touchstart', tStart);
            sliderRef.current.addEventListener('touchend', tEnd);
        }
        return () => {
            window.removeEventListener('touchstart', tStart);
            window.removeEventListener('touchend', tEnd);
        };
    }, []);

    // useEffect(() => {
    //     let timer: any;
    //     const onlongtouch = function () {
    //         console.log('1s');
    //         setVideoCall(true);
    //     };
    //     function touchstart() {
    //         timer = setTimeout(onlongtouch, 1000);
    //     }
    //     function touchend() {
    //         if (timer) {
    //             clearTimeout(timer);
    //         }
    //     }

    //     if (video.current) {
    //         video.current.addEventListener('touchstart', touchstart);
    //         video.current.addEventListener('touchend', touchend);
    //     }
    //     return () => {
    //         window.removeEventListener('touchstart', touchstart);
    //         window.removeEventListener('touchend', touchend);
    //     };
    // }, [startGame, video, videoCall]);

    useEffect(() => {
        getRoom();
    }, []);

    // callback задержки смены поля
    const delay = useCallback(() => {
        setTimeout(() => setField(!fieldIs), 400);
    }, [fieldIs]);

    useEffect(() => {
        // если время на ход вышло
        if (timerOver === true) {
            if (gameStep === 1) {
                // если мы уже в процессе игры
                gameController?.nextQueue();
                setTimerOver(false);
            } else {
                // если мы на старте игры
                handlerGameOver(activeFieldIds.opponent);
            }
        }
    }, [timerOver]);

    useEffect(() => {
        // следит за изменениями полей
        setGameStatistics(gameController?.getStatistics() ?? []);
        // проверка очереди хода
        if (
            (gameController?.getShotQueue() ?? activeFieldIds.player) ===
            activeFieldIds.player
        ) {
            // если игрок, то меняем цвет таймера и включаем задержку на переход к полю противника
            if (timerDisplay === false) delay();
            setTimerDisplay(true);
        } else {
            if (timerDisplay === true) delay();
            setTimerDisplay(false);
        }
    }, [playerField, opponentField]);

    return (
        <Layout>
            <div className={styles.game__background}>
                <FullScreenView isFullscr={isFull}>
                    <Header
                        user={anotherUser}
                        updateTimer={[opponentField, playerField]}
                        display={timerDisplay}
                        handler={() => setTimerOver(true)}
                        gameOver={gameOver}
                    />
                    <div className={styles['game__main-content']}>
                        <div className={styles.game__container}>
                            <div
                                className={cn(
                                    styles.game__slider,
                                    startGame && !trnslX
                                        ? styles.game__left
                                        : styles.game__right,
                                )}
                                ref={sliderRef}
                            >
                                <div>
                                    <div
                                        className={cn(
                                            styles.game__field,
                                            styles.disabled,
                                            startGame && fieldIs
                                                ? styles.active
                                                : '',
                                        )}
                                    >
                                        <Area
                                            ref={botCanvasRef}
                                            areaWidth={startAreaWidth()}
                                            fillColor="#9DC0F0"
                                            onClick={handlerPlayerShot}
                                            {...opponentField}
                                        />
                                    </div>
                                    <div
                                        className={cn(
                                            styles.game__field,
                                            styles.disabled,
                                            startGame && fieldIs
                                                ? ''
                                                : styles.active,
                                        )}
                                    >
                                        <Area
                                            ref={playerCanvasRef}
                                            areaWidth={startAreaWidth()}
                                            {...playerField}
                                        />
                                    </div>
                                </div>
                                <div className={styles['game__slider-stat']}>
                                    <Statistics statistics={gameStatistics} />
                                </div>
                            </div>
                            {startGame && (
                                <Button
                                    onClick={() => setField(!fieldIs)}
                                    title="switch"
                                    color="blue"
                                    className={styles.game__switch}
                                />
                            )}
                        </div>
                        {!startGame ? (
                            <div className={styles.game__docs}>
                                <ShipsMenu
                                    imgWidth={startAreaWidth() / 10}
                                    onDragStart={
                                        placementArea.handlerShipDragStart
                                    }
                                    onDrop={placementArea.handlerShipDragEnd}
                                    onDragOver={placementArea.handlerShipOver}
                                    onContextMenu={placementArea.rotationShip}
                                />
                            </div>
                        ) : (
                            <Chat {...{ videoCall }} />
                        )}
                    </div>
                    <Footer
                        {...{
                            videoCall,
                            isFull,
                            startGame,
                            placementArea,
                            setStartGame,
                            setPlayerMatrix,
                            setPlayerSquadron,
                            setGameStep,
                            setIsFull,
                            setVideoCall,
                        }}
                    />
                    {gameOver && (
                        <EndGameComponent screen={gameOver} room={room} />
                    )}
                </FullScreenView>
            </div>
        </Layout>
    );
};
