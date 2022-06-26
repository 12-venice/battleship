// @ts-nocheck
/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { Preloader } from 'src/components/Preloader';
import { useHttp } from 'src/hooks/http.hook';
import { messageService } from 'src/store/services/messageService';
import { socket } from '../utils/Socket/Socket';
import { VideoChat } from '../VideoChat';
import styles from './Chat.scss';
import { Message } from './components/Message';
import { messageType } from './components/Message/types';
import { getBotMessage } from './config';

export const Chat = (): JSX.Element => {
    const videoCall = useOutletContext();
    const { request, loading } = useHttp();
    const { room } = useParams() as { room: string };
    const [messages, setMessages] = useState([] as messageType[]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        socket.on('messages:recived', (data) => {
            if (room === data.room) {
                const newArr = [...messages, ...[data]];
                setMessages(newArr);
            }
        });
        return () => {
            socket.off('messages:recived');
        };
    }, [messages, room]);

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
        messageService.selectMessage();
    }, []);

    useEffect(() => {
        if (room === 'bot') {
            setMessages([getBotMessage()]);
        } else {
            getMessages();
        }
        return () => setMessages([]);
    }, [getMessages, room]);

    if (loading) {
        return <Preloader />;
    }
    return (
        <div className={styles.chat__block}>
            {videoCall ? (
                <VideoChat />
            ) : (
                messages.map((message: messageType) => (
                    <Message
                        key={message._id.toString()}
                        _id={message._id}
                        text={message.text}
                        user={message.user}
                        createdAt={message.createdAt}
                        delivered={message.delivered}
                    />
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};
