/* eslint-disable @typescript-eslint/ban-types */
import { Button } from 'src/components/Button';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { useCallback } from 'react';
import { Placement } from 'src/gameCore/Placement';
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
}) => {
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );

    const handleGameStart = useCallback(() => {
        setPlayerMatrix(placementArea.getMatrix());
        setPlayerSquadron(placementArea.getSquadron());
        setGameStep(1);
        setStartGame(!startGame);
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
                    className={styles.icon}
                    src={isFull ? fsExitIcon : fsIcon}
                    alt="Add"
                />
            </Button>
            {startGame ? (
                <InputMessage {...{ videoCall, setVideoCall }} />
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
    );
};
