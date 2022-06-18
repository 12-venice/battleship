/* eslint-disable @typescript-eslint/ban-types */
import { Button } from 'src/components/Button';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { useCallback } from 'react';
import { Placement } from 'src/gameCore/Placement';
import { useParams } from 'react-router-dom';
import { InputMessage } from 'src/components/InputMessage';
import { Icon } from 'src/components/Icon/Icon';
import styles from './Footer.scss';

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
    const { room } = useParams() as { room: string };

    const handleGameStart = useCallback(() => {
        if (Object.entries(placementArea.getSquadron()).length === 10) {
            setPlayerMatrix(placementArea.getMatrix());
            setPlayerSquadron(placementArea.getSquadron());
            setGameStep(1);
            setStartGame(!startGame);
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
                <Icon type={isFull ? 'fsexit' : 'fs'} />
            </Button>
            {startGame ? (
                room !== 'bot' && (
                    <InputMessage
                        videoCall={videoCall}
                        setVideoCall={() => setVideoCall()}
                    />
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
                        <Icon type="roundarrow" />
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
