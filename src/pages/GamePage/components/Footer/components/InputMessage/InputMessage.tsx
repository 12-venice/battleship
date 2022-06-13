/* eslint-disable @typescript-eslint/ban-types */
import cn from 'classnames';
import { FormEvent, useState } from 'react';
import { Button } from 'src/components/Button';
import { useParams } from 'react-router-dom';
import { socket } from 'src/components/utils/Socket/Socket';
import styles from './InputMessage.scss';
import sendIcon from '../../../../../../../images/send.svg';
// import videoIcon from '../../../../../../../images/video.svg';

export const InputMessage = ({
    videoCall,
    setVideoCall,
}: {
    videoCall: boolean;
    setVideoCall: Function;
}) => {
    const { room } = useParams() as { room: string };
    const [message, setMessage] = useState('');
    const sendMessageHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message) {
            socket.emit('messages:sent', { room, message });
            setMessage('');
        }
    };
    return (
        <form
            className={styles.inputMessage__block}
            onSubmit={(e) => sendMessageHandler(e)}
        >
            <input
                className={cn(styles.inputMessage__input, 'browser-default')}
                type="text"
                placeholder="Message"
                name="MessageInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button skin="quad" type="submit">
                <img
                    className={styles.footer__icon}
                    src={sendIcon}
                    alt="Send"
                />
            </Button>
        </form>
    );
};
