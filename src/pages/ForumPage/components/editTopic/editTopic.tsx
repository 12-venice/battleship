import cn from 'classnames';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { useCallback, useContext, useState } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { Props } from './types';
import styles from './editTopic.scss';

export const EditTopicWindow: Props = ({ close }): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { request, loading } = useHttp();
    const { topic, theme, description, comment, message } = useSelector(
        (messageState: AllStateTypes) => messageState.message,
    );
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const [themeBlock, setThemeBlock] = useState(theme);
    const [descriptionBlock, setDescriptionBlock] = useState(
        comment ? message : description,
    );

    const editTopic = useCallback(async () => {
        const newTopic = {
            _id: topic,
            theme: themeBlock,
            description: descriptionBlock,
        };
        await request('/api/topic/update', 'POST', newTopic, {
            Authorization: `Bearer ${token}`,
        });
        close();
    }, [topic, themeBlock, descriptionBlock, request, token, close]);

    const editComment = useCallback(async () => {
        const newComment = {
            _id: comment,
            message: descriptionBlock,
        };
        await request('/api/comment/update', 'POST', newComment, {
            Authorization: `Bearer ${token}`,
        });
        close();
    }, [comment, descriptionBlock, request, token, close]);

    return (
        <ModalWindow>
            <h2 className={styles['add-topic__label']}>
                {comment
                    ? dataStore.labels.editComment
                    : dataStore.labels.editTopic}
            </h2>
            {!comment && (
                <input
                    className={cn(
                        'browser-default',
                        styles['add-topic__input'],
                    )}
                    type="text"
                    value={themeBlock}
                    placeholder={dataStore.labels.theme}
                    maxLength={45}
                    onChange={(e) => setThemeBlock(e.target.value)}
                />
            )}
            <textarea
                className={styles['add-topic__textarea']}
                value={descriptionBlock}
                placeholder={
                    comment
                        ? dataStore.text.editComment
                        : dataStore.text.editTopic
                }
                maxLength={500}
                onChange={(e) => setDescriptionBlock(e.target.value)}
            />
            <div className={styles['add-topic__buttons']}>
                <Button
                    skin="high"
                    color="green"
                    title={dataStore.buttons.edit}
                    disabled={loading}
                    onClick={() => (comment ? editComment() : editTopic())}
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
