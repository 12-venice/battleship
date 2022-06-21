import cn from 'classnames';
import { Button } from 'src/components/Button';
import { useSelector } from 'react-redux';
import { User } from 'src/store/reducers/user';
import { AllStateTypes } from 'src/store/reducers';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Information } from 'src/components/Information';
import { Preloader } from 'src/components/Preloader';
import styles from './Header.scss';
import { PlayerName } from './components/PlayerName';
import { getBot } from '../Chat/config';
import { Timer } from './helpers/easyTimer';
import { CloseGameDialog } from '../CloseGameDialog';

export const Header = ({
    user,
    updateTimer,
    display,
    handler,
    gameOver,
    account,
    gameStep,
    startOnlineTimer,
}: {
    user: User | undefined;
    updateTimer: any;
    display: boolean;
    handler: any;
    gameOver: boolean | null;
    account: number[];
    gameStep: number;
    startOnlineTimer: boolean;
}) => {
    const [info, setinfo] = useState(false);
    const [exit, setExit] = useState(false);
    const [timer, setTimer] = useState(15);
    const { room } = useParams() as { room: string };
    const [anotherUser, setAnotherUser] = useState({} as User);
    const thisUser = useSelector((state: AllStateTypes) => state.user.item);
    useEffect(() => {
        if (room === 'bot') {
            setAnotherUser(getBot());
        }
        if (user !== undefined) {
            setAnotherUser(user);
        }
    }, [room, user]);
    const isTimeOver = () => {
        handler();
    };
    const gameTimer = useMemo(() => new Timer(15, setTimer, isTimeOver), []);
    useEffect(() => {
        if (gameOver) {
            gameTimer.stop();
        } else if (gameStep === 1) {
            gameTimer.start();
            setTimer(15);
        }
    }, [...updateTimer, gameOver]);
    useEffect(() => {
        if (gameOver) {
            gameTimer.stop();
        } else {
            gameTimer.start();
            setTimer(15);
        }
    }, [startOnlineTimer]);
    const getInfo = () => {
        setinfo(!info);
    };

    return (
        <>
            <div className={styles.game__header}>
                <Button skin="quad" title="i" onClick={getInfo} />
                <div className={styles['game__header-players']}>
                    <div
                        className={cn(
                            styles['game__header-text'],
                            styles['game__header-active'],
                        )}
                    >
                        {account[0]}
                    </div>
                    <PlayerName user={thisUser} avatarPosition="right" />
                    <div
                        className={cn(
                            styles['game__header-text'],
                            styles['game__header-timer'],
                            display && styles['game__header-active'],
                        )}
                    >
                        {gameStep >= 1 && timer}
                    </div>
                    {Object.keys(anotherUser).length === 0 ? (
                        <Preloader />
                    ) : (
                        <PlayerName user={anotherUser} avatarPosition="left" />
                    )}
                    <div className={styles['game__header-text']}>
                        {account[1]}
                    </div>
                </div>
                <Button
                    onClick={() => setExit(!exit)}
                    skin="quad"
                    title="X"
                    color="red"
                />
            </div>
            {info && <Information close={getInfo} />}
            {exit && (
                <CloseGameDialog
                    gameStep={gameStep}
                    close={() => setExit(!exit)}
                />
            )}
        </>
    );
};
