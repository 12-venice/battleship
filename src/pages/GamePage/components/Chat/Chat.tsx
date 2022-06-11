/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from 'src/components/Preloader';
import { socket } from 'src/components/utils/Socket/Socket';
import { useHttp } from 'src/hooks/http.hook';
import styles from './Chat.scss';
import { Message } from './components/Message';
import { messageType } from './components/Message/types';

export const Chat = ({ videoCall }: { videoCall: boolean }): JSX.Element => {
    const { request, loading } = useHttp();
    const { room } = useParams() as { room: string };
    const [messages, setMessages] = useState([] as messageType[]);

    socket.on('messages:recive', (data) => {
        console.log(room === data.room);
        if (room === data.room) {
            const newArr = [...messages, ...[data]];
            setMessages(newArr);
        }
    });

    socket.on(
        'move:recive',
        ({ roomID, data }: { roomID: string; data: {} }) => {
            if (room === roomID) {
                console.log(data);
            }
        },
    );

    const sentMove = (data: {}) => {
        socket.emit('move:sent', { roomID: room, data });
    };

    const getMessages = useCallback(async () => {
        const data = await request('/api/message/read', 'POST', { room });
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
            const botMessage1 = {
                user: { _id: 'bot' },
                date: Date.now(),
                text: 'Bla bla bla',
                delivered: false,
            } as unknown as messageType;
            setMessages([
                botMessage,
                botMessage1,
                botMessage,
                botMessage,
                botMessage,
                botMessage,
                botMessage,
                botMessage,
                botMessage,
                botMessage,
            ]);
        } else {
            getMessages();
        }
        return () => setMessages([]);
    }, [getMessages, room]);
    if (videoCall) {
        return <div className={styles.chat__block}>VIDEOCALL</div>;
    }

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