/* eslint-disable @typescript-eslint/ban-types */
import cn from 'classnames';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Button } from 'src/components/Button';
import { useParams } from 'react-router-dom';
import { socket } from 'src/components/utils/Socket/Socket';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { File, FileInput } from 'src/pages/UpdateProfilePage/components/types';
import styles from './InputMessage.scss';
import { Icon } from '../Icon/Icon';

export const InputMessage = ({
    videoCall,
    setVideoCall,
}: {
    videoCall: boolean;
    setVideoCall: Function;
}) => {
    const { room } = useParams() as { room: string };
    const [message, setMessage] = useState('');

    const fileInput = useRef<FileInput>(null);
    const { token } = useAuth();
    const { request, loading } = useHttp();
    const uploadImage = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('image', file ?? '');
            await request(`/api/upload/image/${room}`, 'POST', formData, {
                Authorization: `Bearer ${token}`,
                'Content-Disposition': 'form-data',
            });
        } catch (e) {
            throw new Error('Что-то пошло не так');
        }
    };

    const handlerImageCustom = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;
        uploadImage(e.target.files[0]);
    };

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
            <Button
                skin="quad"
                color="blue"
                onClick={() => fileInput.current && fileInput.current.click()}
                disabled={loading}
            >
                <Icon type="plus" />
            </Button>
            <input
                className={cn(styles.inputMessage__input, 'browser-default')}
                type="text"
                placeholder="Message"
                name="MessageInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button skin="quad" type="submit">
                <Icon type="send" />
            </Button>
            <input
                accept=".png, .jpg, .jpeg"
                hidden
                onChange={(e) => handlerImageCustom(e)}
                type="file"
                ref={fileInput}
            />
        </form>
    );
};
