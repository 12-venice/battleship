import { Button } from 'src/components/Button';
import { useSelector } from 'react-redux';
import { User } from 'src/store/reducers/user';
import { AllStateTypes } from 'src/store/reducers';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Information } from 'src/components/Information';
import Countdown from 'react-countdown';
import { Preloader } from 'src/components/Preloader';
import styles from './Header.scss';
import { PlayerName } from './components/PlayerName';

export const Header = ({ user }: { user: User | undefined }) => {
    const navigate = useNavigate();
    const [info, setinfo] = useState(false);
    const [timer, setTimer] = useState(30000);
    const { room } = useParams() as { room: string };
    const [anotherUser, setAnotherUser] = useState({} as User);
    const thisUser = useSelector((state: AllStateTypes) => state.user.item);
    useEffect(() => {
        if (room === 'bot') {
            setAnotherUser({
                _id: 'bot',
                display_name: 'Captain Jack',
                avatar: '',
                first_name: 'Jack',
                second_name: 'Captain',
                rooms: [],
                email: 'bot',
                login: 'bot',
                phone: '',
                id: 0,
            });
        }
        if (user !== undefined) {
            setAnotherUser(user);
        }
    }, [room, user]);

    const getInfo = () => {
        setinfo(!info);
    };
    const timeIsOver = () => {
        setTimer(30000);
        console.log('Time is over');
    };

    return (
        <>
            <div className={styles.game__header}>
                <Button skin="quad" title="i" onClick={getInfo} />
                <div className={styles['game__header-players']}>
                    <div className={styles['game__header-text']}>0</div>
                    <PlayerName user={thisUser} avatarPosition="right" />
                    <div className={styles['game__header-text']}>
                        <Countdown
                            date={Date.now() + timer}
                            onComplete={timeIsOver}
                            renderer={(props) => <div>{props.seconds}</div>}
                        />
                    </div>
                    {Object.keys(anotherUser).length === 0 ? (
                        <Preloader />
                    ) : (
                        <PlayerName user={anotherUser} avatarPosition="left" />
                    )}
                    <div className={styles['game__header-text']}>0</div>
                </div>
                <Button
                    onClick={() => navigate(-1)}
                    skin="quad"
                    title="X"
                    color="red"
                />
            </div>
            {info && <Information close={getInfo} />}
        </>
    );
};
