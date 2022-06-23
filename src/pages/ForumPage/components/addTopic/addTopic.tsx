// @ts-nocheck
import cn from 'classnames';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { useCallback, useState } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { useAuth } from 'src/hooks/auth.hook';
import { Props } from './types';
import styles from './addTopic.scss';

export const AddTopicWindow: Props = ({ close }): JSX.Element => {
    const { request, loading } = useHttp();
    const { token } = useAuth();
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const [theme, setTheme] = useState('');
    const [description, setDescription] = useState('');
    const createTopic = useCallback(async () => {
        const newTopic = {
            theme,
            description,
        };
        await request('/api/topic/create', 'POST', newTopic, {
            Authorization: `Bearer ${token}`,
        });
        close();
    }, [close, description, request, theme, token]);
    return (
        <ModalWindow>
            <h2 className={styles['add-topic__label']}>
                {dataStore.labels.add}
            </h2>
            <input
                className={cn('browser-default', styles['add-topic__input'])}
                type="text"
                placeholder={dataStore.labels.theme}
                maxLength={45}
                onChange={(e) => setTheme(e.target.value)}
            />
            <textarea
                className={styles['add-topic__textarea']}
                placeholder={dataStore.text.add}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className={styles['add-topic__buttons']}>
                <Button
                    skin="high"
                    color="green"
                    title={dataStore.buttons.add}
                    disabled={loading}
                    onClick={createTopic}
                />
                <Button
                    skin="high"
                    color="yellow"
                    title={dataStore.buttons.back}
                    onClick={close}
                />
            </div>
        </ModalWindow>
    );
};
