import cn from 'classnames';
import { createRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { Information } from 'src/components/Information';
import { Layout } from 'src/components/Layout';
import { Controller } from 'src/gameCore/Controller';
import { Placement } from 'src/gameCore/Placement';
import { AllStateTypes } from 'src/store/reducers';
import { FullScreenView } from 'src/components/api/Fullscreen/FullScreenView';
import { MatrixCell } from 'src/gameCore/types';
import { useParams } from 'react-router-dom';
import { useHttp } from 'src/hooks/http.hook';
import { Preloader } from 'src/components/Preloader';
import { sendMessage } from 'src/components/utils/Socket/Listeners';
import fsIcon from '../../../images/fs.svg';
import fsExitIcon from '../../../images/fs_exit.svg';
import arrowIcon from '../../../images/round_arrow.svg';
import sendIcon from '../../../images/send.svg';
import closeIcon from '../../../images/close.svg';
import videoIcon from '../../../images/video.svg';
import { Area } from './components/Area';
import { PlayerName } from './components/PlayerName';
import { ShipsMenu } from './components/ShipsMenu';
import styles from './GamePage.scss';
import { mapStateToProps } from './mapState';
import { Chat } from './components/Chat';

const STATISTICS = [
    { label: 'HITS', player: 8, opponent: 17 },
    { label: 'MISS', player: 17, opponent: 3 },
    { label: 'ALIVE', player: 3, opponent: 8 },
    { label: 'DESTROYED', player: 2, opponent: 7 },
];

export const GamePage = (): JSX.Element => {
    if (typeof window === 'undefined') return <></>;
    const { room } = useParams();
    const { request, loading } = useHttp();
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const [dataOfRoom, setDataOfRoom] = useState({ messages: [] });
    const [message, setMessage] = useState('');

    const store = useSelector(mapStateToProps);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const playerCanvasRef = createRef<HTMLCanvasElement>();
    const botCanvasRef = createRef<HTMLCanvasElement>();
    const [gameStep, setGameStep] = useState(0);
    const [playerField, setPlayerField] = useState();
    const [opponentField, setOpponentField] = useState();
    const [info, setInfo] = useState(false);
    const [playerMatrix, setPlayerMatrix] = useState();
    const [playerSquadron, setPlayerSquadron] = useState();
    const getInfo = () => setInfo(!info);
    const [startGame, setStartGame] = useState(false);
    const [inviteAccept, setInviteAccept] = useState(
        !!store.opponent_display_name,
    );
    const [videoCall, setVideoCall] = useState(false);

    const sendMessageHandler = () => {
        if (message) {
            sendMessage({ room, message });
            setMessage('');
        }
    };

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
                cell === MatrixCell.deck ? MatrixCell.empty : cell,
            ),
        );

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

    const handleClickAuto = useCallback(() => {
        placementArea.randomLocationShips();
    }, [placementArea]);

    const handleClickReset = useCallback(() => {
        placementArea.resetLocationShips();
    }, [placementArea]);

    const startAreaWidth = useCallback(() => {
        if (window.screen.availWidth < 480) {
            return window.screen.availWidth * 0.8;
        }
        if (
            window.screen.availWidth >= 480 &&
            window.screen.availWidth <= 800
        ) {
            return 380;
        }
        if (window.screen.availWidth > 800 && window.screen.availWidth < 1500) {
            return window.screen.availWidth * 0.25;
        }
        return 380;
    }, []);

    const [areaWidthSize, setareaWidthSize] = useState(startAreaWidth());
    useEffect(() => {
        function winResize() {
            const width = window.screen.availWidth;
            if (width < 480) {
                setareaWidthSize(width * 0.8);
            } else if (width >= 480 && width <= 800) {
                setareaWidthSize(378);
            } else if (width > 800 && width < 1500) {
                setareaWidthSize(width * 0.25);
            } else if (width >= 1500) {
                setareaWidthSize(380);
            }
        }
        window.addEventListener('resize', winResize);
        return () => window.removeEventListener('resize', winResize);
    }, []);

    const [trnslX, setTrnslX] = useState(true);
    const sliderRef = createRef<HTMLDivElement>();
    useEffect(() => {
        let tuchX = 0;
        let delt = false;
        const tStart = (e: TouchEvent) => {
            tuchX = e.changedTouches[0].clientX;
            // console.log('start')
        };
        const tEnd = (e: TouchEvent) => {
            if (Math.abs(tuchX - e.changedTouches[0].clientX) > 40) {
                delt = !delt;
                setTrnslX(!delt);
                // console.log('end')
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
    }, [inviteAccept]);

    const video = createRef<HTMLDivElement>();
    useEffect(() => {
        let timer: any;
        const onlongtouch = function () {
            console.log('1s');
            setVideoCall(true);
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
        return () => {
            window.removeEventListener('touchstart', touchstart);
            window.removeEventListener('touchend', touchend);
        };
    }, [inviteAccept, startGame, videoCall]);
    const [isFull, setIsFull] = useState(false);
    const handleGameStart = useCallback(() => {
        setPlayerMatrix(placementArea.getMatrix());
        setPlayerSquadron(placementArea.getSquadron());
        setGameStep(1);
        setStartGame(!startGame);
    }, [placementArea]);

    if (loading) {
        return <Preloader />;
    }

    return (
        <Layout>
            <div className={styles.game__background}>
                <FullScreenView isFullscr={isFull}>
                    <div className={styles.game__header}>
                        <Button skin="quad" title="i" onClick={getInfo} />
                        <div className={styles['game__header-players']}>
                            <p className={styles['game__header-text']}>0</p>
                            <PlayerName
                                name={user?.display_name ?? 'Player 1'}
                                avatarPosition="right"
                                avatarSrc={`https://ya-praktikum.tech/api/v2/resources${user?.avatar}`}
                            />
                            <p className={styles['game__header-text']}>00</p>
                            <PlayerName
                                name={
                                    dataOfRoom?.anotherUser?.display_name ??
                                    'Player 2'
                                }
                                avatarPosition="left"
                                avatarSrc={`https://ya-praktikum.tech/api/v2/resources${dataOfRoom?.anotherUser?.avatar}`}
                            />
                            <p className={styles['game__header-text']}>0</p>
                        </div>
                        <Button href="/" skin="quad" title="X" color="red" />
                    </div>
                    <div className={styles['game__main-content']}>
                        {inviteAccept ? (
                            <Button
                                title="invite"
                                color="green"
                                onClick={() => setInviteAccept(!inviteAccept)}
                            />
                        ) : (
                            <div className={styles.game__container}>
                                <div
                                    className={cn(
                                        styles.game__slider,
                                        startGame && !trnslX
                                            ? styles.left
                                            : styles.right,
                                    )}
                                    ref={sliderRef}
                                >
                                    <div>
                                        <div
                                            className={cn(
                                                styles.game__field,
                                                styles.disabled,
                                                startGame ? styles.active : '',
                                            )}
                                        >
                                            <Area
                                                ref={botCanvasRef}
                                                areaWidth={areaWidthSize}
                                                fillColor="#9DC0F0"
                                                onClick={handlerPlayerShot}
                                                {...opponentField}
                                            />
                                        </div>
                                        <div
                                            className={cn(
                                                styles.game__field,
                                                styles.disabled,
                                                startGame ? '' : styles.active,
                                            )}
                                        >
                                            <Area
                                                ref={playerCanvasRef}
                                                areaWidth={areaWidthSize}
                                                {...playerField}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.game__statistics}>
                                        {STATISTICS.map((el) => (
                                            <div key={el.label}>
                                                <h5
                                                    className={
                                                        styles[
                                                            'game__statistics-label'
                                                        ]
                                                    }
                                                >
                                                    {el.label}
                                                </h5>
                                                <span
                                                    className={
                                                        styles[
                                                            'game__statistics-description'
                                                        ]
                                                    }
                                                >
                                                    {`${el.player}/${el.opponent}`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div
                            className={cn(
                                styles.game__docs,
                                startGame || inviteAccept
                                    ? styles.disabled
                                    : '',
                            )}
                        >
                            <ShipsMenu
                                imgWidth={areaWidthSize / 10}
                                onDragStart={placementArea.handlerShipDragStart}
                                onDrop={placementArea.handlerShipDragEnd}
                                onDragOver={placementArea.handlerShipOver}
                                onContextMenu={placementArea.rotationShip}
                            />
                        </div>
                        <div
                            className={cn(
                                styles.game__chat,
                                startGame || inviteAccept ? styles.active : '',
                            )}
                        >
                            {videoCall ? (
                                <div className={styles.game__call} />
                            ) : (
                                <Chat />
                            )}
                        </div>
                    </div>
                    <div className={styles.game__footer}>
                        <div
                            className={styles['game__footer-buttons_controls']}
                        >
                            {inviteAccept || startGame ? (
                                <>
                                    <Button
                                        href="/"
                                        skin="quad"
                                        color="green"
                                        onClick={() => setIsFull(!isFull)}
                                    >
                                        <img
                                            className={styles.icon}
                                            src={isFull ? fsExitIcon : fsIcon}
                                            alt="Add"
                                        />
                                    </Button>
                                    {videoCall ? (
                                        <div ref={video}>
                                            <Button
                                                href="/"
                                                skin="quad"
                                                color="red"
                                                onClick={() =>
                                                    setVideoCall(false)
                                                }
                                            >
                                                <img
                                                    className={styles.icon}
                                                    src={closeIcon}
                                                    alt="Add"
                                                />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                className={cn(
                                                    styles[
                                                        'game__footer-input'
                                                    ],
                                                    'browser-default',
                                                )}
                                                type="text"
                                                value={message}
                                                placeholder="value"
                                                onChange={(e) =>
                                                    setMessage(e.target.value)}
                                            />
                                            <div
                                                className={
                                                    styles[
                                                        'game__footer-controls'
                                                    ]
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles[
                                                            'game__footer-video_btn'
                                                        ]
                                                    }
                                                >
                                                    <Button
                                                        href="/"
                                                        skin="quad"
                                                        onClick={() =>
                                                            setVideoCall(true)
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles.icon
                                                            }
                                                            src={videoIcon}
                                                            alt="Video call"
                                                        />
                                                    </Button>
                                                </div>
                                                <div ref={video}>
                                                    <Button
                                                        href="/"
                                                        skin="quad"
                                                        onClick={
                                                            sendMessageHandler
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles.icon
                                                            }
                                                            src={sendIcon}
                                                            alt="Send"
                                                        />
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Button
                                        href="/"
                                        skin="quad"
                                        color="green"
                                        onClick={() => setIsFull(!isFull)}
                                    >
                                        <img
                                            className={styles.icon}
                                            src={isFull ? fsExitIcon : fsIcon}
                                            alt="Add"
                                        />
                                    </Button>
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
                                        <img
                                            className={styles.icon}
                                            src={arrowIcon}
                                            alt="Add"
                                        />
                                    </Button>
                                    <Button
                                        skin="short"
                                        title={dataStore.buttons.start}
                                        color="green"
                                        onClick={handleGameStart}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </FullScreenView>
            </div>
            {info && <Information close={getInfo} />}
        </Layout>
    );
};
