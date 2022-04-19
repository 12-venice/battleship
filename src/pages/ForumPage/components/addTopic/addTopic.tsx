import cn from 'classnames';

import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';

import { useCallback, useContext, useState } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import { AuthContext } from 'src/context/Authcontext';
import { Props } from './types';

import styles from './addTopic.scss';

export const AddTopicWindow: Props = ({ close }): JSX.Element => {
    const { request, loading } = useHttp();
    const { user } = useContext(AuthContext);
    const [theme, setTheme] = useState('');
    const [description, setDescription] = useState('');
    const createTopic = useCallback(async () => {
        const newTopic = {
            theme,
            description,
            ...user,
        };
        await request('/api/topic/create', 'POST', newTopic, {}, true);
        close();
    }, [close, description, request, theme, user]);
    return (
        <ModalWindow>
            <h2 className={styles['add-topic__label']}>Add new TOPIC</h2>
            <input
                className={cn('browser-default', styles['add-topic__input'])}
                type="text"
                placeholder="Theme"
                maxLength={45}
                onChange={(e) => setTheme(e.target.value)}
            />
            <textarea
                className={styles['add-topic__textarea']}
                placeholder="Describe your topic"
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className={styles['add-topic__buttons']}>
                <Button
                    skin="high"
                    color="green"
                    title="ADD"
                    onClick={createTopic}
                />
                <Button
                    skin="high"
                    color="yellow"
                    title="BACK"
                    onClick={close}
                />
            </div>
        </ModalWindow>
    );
};
