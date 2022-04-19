import cn from 'classnames';

import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';

import { useCallback, useContext, useState } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import { AuthContext } from 'src/context/Authcontext';
import { Props } from './types';

import styles from './editTopic.scss';

export const EditTopicWindow: Props = ({
    close,
    _id,
    oldDescription,
    oldTheme,
}): JSX.Element => {
    const { request, loading } = useHttp();
    const { user } = useContext(AuthContext);
    const [theme, setTheme] = useState(oldTheme);
    const [description, setDescription] = useState(oldDescription);
    const editTopic = useCallback(async () => {
        const newTopic = {
            _id,
            theme,
            description,
            ...user,
        };
        await request('/api/topic/update', 'POST', newTopic, {}, true);
        close();
    }, [_id, close, description, request, theme, user]);
    return (
        <ModalWindow>
            <h2 className={styles['add-topic__label']}>Edit TOPIC</h2>
            <input
                className={cn('browser-default', styles['add-topic__input'])}
                type="text"
                value={theme}
                placeholder="Theme"
                maxLength={45}
                onChange={(e) => setTheme(e.target.value)}
            />
            <textarea
                className={styles['add-topic__textarea']}
                value={description}
                placeholder="Describe your topic"
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className={styles['add-topic__buttons']}>
                <Button
                    skin="high"
                    color="green"
                    title="EDIT"
                    disabled={loading}
                    onClick={editTopic}
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
