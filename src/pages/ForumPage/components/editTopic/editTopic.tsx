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
import styles from './editTopic.scss';

export const EditTopicWindow: Props = ({
    close,
    _id,
    oldDescription,
    oldTheme,
}): JSX.Element => {
    const { token } = useAuth();
    const { request, loading } = useHttp();
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const [theme, setTheme] = useState(oldTheme);
    const [description, setDescription] = useState(oldDescription);
    const editTopic = useCallback(async () => {
        const newTopic = {
            _id,
            theme,
            description,
            ...{ user },
        };
        await request('/api/topic/update', 'POST', newTopic, {
            Authorization: `Bearer ${token}`,
        });
        close();
    }, [_id, close, description, request, theme, token, user]);
    return (
        <ModalWindow>
            <h2 className={styles['add-topic__label']}>
                {dataStore.labels.edit}
            </h2>
            <input
                className={cn('browser-default', styles['add-topic__input'])}
                type="text"
                value={theme}
                placeholder={dataStore.labels.theme}
                maxLength={45}
                onChange={(e) => setTheme(e.target.value)}
            />
            <textarea
                className={styles['add-topic__textarea']}
                value={description}
                placeholder={dataStore.text.add}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className={styles['add-topic__buttons']}>
                <Button
                    skin="high"
                    color="green"
                    title={dataStore.buttons.edit}
                    disabled={loading}
                    onClick={editTopic}
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
