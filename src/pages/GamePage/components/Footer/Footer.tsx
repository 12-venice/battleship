/* eslint-disable @typescript-eslint/ban-types */
import { Button } from 'src/components/Button';
import { useHttp } from 'src/hooks/http.hook';
import { useAuth } from 'src/hooks/auth.hook';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { useCallback } from 'react';
import { Placement } from 'src/gameCore/Placement';
import { useParams } from 'react-router-dom';
import fsIcon from '../../../../../images/fs.svg';
import fsExitIcon from '../../../../../images/fs_exit.svg';
import arrowIcon from '../../../../../images/round_arrow.svg';
import styles from './Footer.scss';
import { InputMessage } from './components/InputMessage';

export const Footer = ({
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
}: {
    videoCall: boolean;
    isFull: boolean;
    startGame: boolean;
    placementArea: Placement;
    setStartGame: Function;
    setPlayerMatrix: Function;
    setPlayerSquadron: Function;
    setGameStep: Function;
    setIsFull: Function;
    setVideoCall: Function;
    setWaitingOnlineGame: Function;
}) => {
    const { request } = useHttp();
    const { token } = useAuth();
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const gameID = useSelector((state: AllStateTypes) => state.game.id);
    const thisUser = useSelector((state: AllStateTypes) => state.user.item);
    const { room } = useParams() as { room: string };

    const createField = async () => {
        const data = {
            gameId: gameID,
            userId: thisUser?._id,
            matrix: placementArea.getMatrix(),
            squadron: placementArea.getSquadron(),
        };
        await request('/api/game/ready', 'POST', data, {
            Authorization: `Bearer ${token}`,
        });
    };

    const handleGameStart = useCallback(() => {
        if (Object.entries(placementArea.getSquadron()).length === 10) {
            if (room === 'bot') {
                setPlayerMatrix(placementArea.getMatrix());
                setPlayerSquadron(placementArea.getSquadron());
                setGameStep(1);
                setStartGame(!startGame);
            } else {
                setWaitingOnlineGame(true);
                createField();
            }
        }
    }, [
        placementArea,
        setGameStep,
        setPlayerMatrix,
        setPlayerSquadron,
        setStartGame,
        startGame,
    ]);

    const handleClickAuto = useCallback(() => {
        placementArea.randomLocationShips();
    }, [placementArea]);

    const handleClickReset = useCallback(() => {
        placementArea.resetLocationShips();
    }, [placementArea]);

    return (
        <div className={styles.game__footer}>
            <Button
                href="/"
                skin="quad"
                color="green"
                onClick={() => setIsFull(!isFull)}
            >
                <img
                    className={styles.footer__icon}
                    src={isFull ? fsExitIcon : fsIcon}
                    alt="Add"
                />
            </Button>
            {startGame ? (
                room !== 'bot' && (
                    <InputMessage {...{ videoCall, setVideoCall }} />
                )
            ) : (
                <>
                    <Button
                        href="/"
                        skin="short"
                        title={dataStore.buttons.auto}
                        onClick={handleClickAuto}
                    />

                    <Button href="/" skin="quad" onClick={handleClickReset}>
                        <img
                            className={styles.footer__icon}
                            src={arrowIcon}
                            alt="Add"
                        />
                    </Button>

                    <Button
                        skin="short"
                        title={
                            room === 'bot' ? dataStore.buttons.start : 'READY'
                        }
                        color="green"
                        onClick={handleGameStart}
                    />
                </>
            )}
        </div>
    );
};
