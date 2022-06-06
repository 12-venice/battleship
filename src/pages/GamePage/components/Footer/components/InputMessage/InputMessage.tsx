/* eslint-disable @typescript-eslint/ban-types */
import { useState } from 'react';
import { Button } from 'src/components/Button';
import { SendMessage } from 'src/components/utils/Socket/Listeners';
import { useParams } from 'react-router-dom';
import styles from './InputMessage.scss';
import sendIcon from '../../../../../../../images/send.svg';
import videoIcon from '../../../../../../../images/video.svg';

export const InputMessage = ({
    videoCall,
    setVideoCall,
}: {
    videoCall: boolean;
    setVideoCall: Function;
}) => {
    const { room } = useParams() as { room: string };
    const [message, setMessage] = useState('');
    const sendMessageHandler = () => {
        if (message) {
            SendMessage({ room, message });
            setMessage('');
        }
    };
    return (
        <div className={styles.inputMessage__block}>
            <input
                className={styles.inputMessage__input}
                type="text"
                placeholder="Message"
                name="MessageInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button skin="quad" onClick={() => setVideoCall(!videoCall)}>
                <img className={styles.icon} src={videoIcon} alt="Video call" />
            </Button>
            <Button skin="quad" onClick={sendMessageHandler}>
                <img className={styles.icon} src={sendIcon} alt="Send" />
            </Button>
        </div>
    );
};
