/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from 'src/components/Preloader';
import { useHttp } from 'src/hooks/http.hook';
import styles from './Chat.scss';
import { Message } from './components/Message';
import { messageType } from './components/Message/types';

export const Chat = ({ videoCall }: { videoCall: boolean }): JSX.Element => {
    const { request, loading } = useHttp();
    const { room } = useParams() as { room: string };
    const [messages, setMessages] = useState([] as messageType[]);

    const getMessages = useCallback(async () => {
        const data = await request(
            '/api/message/read',
            'POST',
            { room },
            {},
            true,
        );
        setMessages(data);
    }, [request, room]);

    useEffect(() => {
        if (room === 'bot') {
            const botMessage = {
                user: { _id: 'bot' },
                date: Date.now(),
                text: 'Hello my friend! Arrrggg....',
                delivered: false,
            } as unknown as messageType;
            setMessages([botMessage]);
        } else {
            getMessages();
        }
        return () => setMessages([]);
    }, [getMessages, room]);

    return (
        <div className={styles.chat__block}>
            {loading ? (
                <Preloader />
            ) : (
                messages
                    .slice(0)
                    .reverse()
                    .map((message: messageType) => (
                        <Message key={message._id} {...message} />
                    ))
            )}
        </div>
    );
};
