/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from 'src/components/Preloader';
import { socket } from 'src/components/utils/Socket/Socket';
import { useHttp } from 'src/hooks/http.hook';
import styles from './Chat.scss';
import { Message } from './components/Message';
import { messageType } from './components/Message/types';
import { getBotMessage } from './config';

export const Chat = ({ videoCall }: { videoCall: boolean }): JSX.Element => {
    const { request, loading } = useHttp();
    const { room } = useParams() as { room: string };
    const [messages, setMessages] = useState([] as messageType[]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    socket.on('messages:recive', (data) => {
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (room === 'bot') {
            setMessages([getBotMessage()]);
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
                messages.map((message: messageType) => (
                    <Message key={message._id} {...message} />
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};
