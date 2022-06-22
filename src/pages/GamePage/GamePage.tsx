import cn from 'classnames';
import {
    createRef,
    useState,
    useCallback,
    useMemo,
    useEffect,
    useContext,
} from 'react';
import { useSelector } from 'react-redux';
import { Layout } from 'src/components/Layout';
import {
    Controller,
    mockAccount,
    mockStatistics,
} from 'src/gameCore/Controller';
import { Placement } from 'src/gameCore/Placement';
import { AllStateTypes } from 'src/store/reducers';
import { FullScreenView } from 'src/components/api/Fullscreen/FullScreenView';
import { MatrixCell } from 'src/gameCore/types';
import { useParams } from 'react-router-dom';
import { useHttp } from 'src/hooks/http.hook';
import { User } from 'src/store/reducers/user';
import { Button } from 'src/components/Button';
import { activeFieldIds } from 'src/gameCore/Controller/types';
import { getCoordinates } from 'src/gameCore/helpers';
import { gameService } from 'src/store/services/gameService';
import { Chat } from 'src/components/Chat';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { Area } from './components/Area';
import { ShipsMenu } from './components/ShipsMenu';
import styles from './GamePage.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EndGameComponent } from './components/EndGame';
import { Statistics } from './components/Statistics';
import { Waiting } from './components/Waiting';
import { CancelGame } from './components/CancelGame';

export const GamePage = (): JSX.Element => {
    const { request } = useHttp();
    const { room } = useParams() as { room: string };
    const thisUser = useSelector((state: AllStateTypes) => state.user.item);
    const onlineGame = useSelector((state: AllStateTypes) => state.game);
    const { token } = useContext(AuthContext);

    const [anotherUser, setAnotherUser] = useState();
    const [gameStep, setGameStep] = useState(0);
    const [playerField, setPlayerField] = useState();
    const [opponentField, setOpponentField] = useState();
    const [playerMatrix, setPlayerMatrix] = useState();
    const [playerSquadron, setPlayerSquadron] = useState();
    const [startGame, setStartGame] = useState(false);
    const [queueOnlineGame, setQueueOnlineGame] = useState(false);
    const [waitingOnlineGame, setWaitingOnlineGame] = useState(false);
    const [startOnlineTimer, setStartOnlineTimer] = useState(false);
    const [videoCall, setVideoCall] = useState(false);
    const [trnslX, setTrnslX] = useState(true);
    const [isFull, setIsFull] = useState(false);
    const [fieldIs, setField] = useState(true);
    const [gameOver, setGameOver] = useState(null);
    const [gameCanceled, setGameCanceled] = useState(false);
    const [gameStatistics, setGameStatistics] = useState(mockStatistics());
    const [gameAccount, setGameAccount] = useState(mockAccount());
    const [timerDisplay, setTimerDisplay] = useState(true);
    const [timerOver, setTimerOver] = useState(false);

    const sliderRef = createRef<HTMLDivElement>();
    const playerCanvasRef = createRef<HTMLCanvasElement>();
    const botCanvasRef = createRef<HTMLCanvasElement>();

    // следим за стейтом онлайн игры
    useEffect(() => {
        if (onlineGame.gameCancel) {
            gameService.finishGame();
            setGameCanceled(true);
        }
        if (onlineGame.state?.opponentField && onlineGame.state?.playerField) {
            setGameAccount(onlineGame.state.score);
            setGameStatistics(onlineGame.state.statistics);
            if (onlineGame.state.queue === thisUser?._id) {
                setQueueOnlineGame(true);
                setTimerDisplay(true);
            } else {
                setQueueOnlineGame(false);
                setTimerDisplay(false);
            }
            setStartOnlineTimer(!startOnlineTimer);
            setStartGame(true);
            if (gameStep === 0) {
                setWaitingOnlineGame(false);
                setGameStep(2);
            }
            setPlayerField(onlineGame.state.playerField);
            setOpponentField(onlineGame.state.opponentField);
            if (onlineGame.state.finish) {
                gameService.finishGame();
                if (onlineGame.state.queue === thisUser?._id) {
                    setGameOver('victory');
                } else {
                    setGameOver('defeat');
                }
            }
        }
    }, [onlineGame]);

    // запрашиваем данные второго игрока
    const getRoom = useCallback(async () => {
        const data = await request(`/api/room/${room}`, 'GET', null);
        setAnotherUser(
            data.users.find((user: User) => user._id !== thisUser?._id),
        );
    }, [request, room, thisUser?._id]);

    // обработчик конца игры
    const handlerGameOver = useCallback((winner) => {
        if (winner === activeFieldIds.opponent) {
            setGameOver('defeat');
        } else {
            setGameOver('victory');
        }
    }, []);

    // хендлер обработки данных поля игрока для рендера
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

    // хендлер обработки данных поля соперника для рендера
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

    // создаем управляющий контроллер для игры с ботом
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

    // обработчик выстрела игрока
    const handlerPlayerShot = useCallback(
        (event) => {
            if (gameController?.handlerPlayerShot) {
                gameController.handlerPlayerShot(event);
            }
        },
        [gameController],
    );

    const fireShot = async ({ x, y }) => {
        const data = {
            gameId: onlineGame.id,
            userId: thisUser?._id,
            shot: { x, y },
        };
        await request('/api/game/shot', 'POST', data, {
            Authorization: `Bearer ${token}`,
        });
    };

    const onlineHandlerPlayerShot = useCallback(
        (event) => {
            if (queueOnlineGame) {
                const areaCoords = getCoordinates(event.target);
                const cellSize = event.target.width / 10;
                const x = Math.trunc((event.pageY - areaCoords.top) / cellSize);
                const y = Math.trunc(
                    (event.pageX - areaCoords.left) / cellSize,
                );
                fireShot({ x, y });
            }
        },
        [gameController, queueOnlineGame],
    );

    // размеры игрового поля при старте игры (ресайз)
    const startAreaWidth = useCallback(() => {
        if (typeof window === 'undefined') {
            return 250;
        }
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

    // слайдер
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

    // получаем данные соперника после маунта
    useEffect(() => {
        getRoom();
    }, []);

    // callback задержки смены поля БОТ
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
            }
            setTimerOver(false);
        }
    }, [timerOver]);

    useEffect(() => {
        // следит за изменениями полей
        if (gameStep === 1) {
            setGameStatistics(
                gameController?.getStatistics() ?? mockStatistics(),
            );
            setGameAccount(gameController?.getAccount() ?? mockAccount());
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
                        account={gameAccount}
                        gameStep={gameStep}
                        startOnlineTimer={startOnlineTimer}
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
                                            onClick={
                                                gameStep === 2
                                                    ? onlineHandlerPlayerShot
                                                    : handlerPlayerShot
                                            }
                                            {...opponentField}
                                            fireType
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
                                            fireType={false}
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
                            setWaitingOnlineGame,
                        }}
                    />
                    {gameOver && (
                        <EndGameComponent
                            screen={gameOver}
                            room={room}
                            gameAccount={gameAccount}
                            gameStatistics={gameStatistics}
                        />
                    )}
                    {waitingOnlineGame && <Waiting />}
                    {gameCanceled && <CancelGame />}
                </FullScreenView>
            </div>
        </Layout>
    );
};
