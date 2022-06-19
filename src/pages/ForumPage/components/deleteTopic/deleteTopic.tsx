import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { useCallback, useContext } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { Props } from './types';
import styles from './deleteTopic.scss';

export const DeleteTopicWindow: Props = ({ close }): JSX.Element => {
    const { token } = useContext(AuthContext);
    const { topic, comment } = useSelector(
        (messageState: AllStateTypes) => messageState.message,
    );
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { request, loading } = useHttp();

    const deleteTopic = useCallback(async () => {
        await request(
            '/api/topic/delete',
            'POST',
            { _id: topic },
            {
                Authorization: `Bearer ${token}`,
            },
        );
        close();
    }, [topic, close, request, token]);

    const deleteComment = useCallback(async () => {
        await request(
            '/api/comment/delete',
            'POST',
            { _id: comment },
            {
                Authorization: `Bearer ${token}`,
            },
        );
        close();
    }, [comment, close, request, token]);

    return (
        <ModalWindow>
            <h2 className={styles['delete-topic__label']}>
                {comment
                    ? dataStore.labels.deleteComment
                    : dataStore.labels.deleteTopic}
            </h2>
            <p className={styles['delete-topic__description']}>
                {comment
                    ? dataStore.text.deleteComment
                    : dataStore.text.deleteTopic}
            </p>
            <div className={styles['delete-topic__buttons']}>
                <Button
                    skin="high"
                    color="red"
                    title={dataStore.buttons.delete}
                    disabled={loading}
                    onClick={() => (comment ? deleteComment() : deleteTopic())}
                />
                <Button
                    skin="high"
                    color="green"
                    title={dataStore.buttons.back}
                    onClick={close}
                />
            </div>
        </ModalWindow>
    );
};
