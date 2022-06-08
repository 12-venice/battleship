import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';

import { useCallback } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { Props } from './types';

import styles from './deleteTopic.scss';

export const DeleteTopicWindow: Props = ({ close, _id }): JSX.Element => {
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const { request, loading } = useHttp();
    const deleteTopic = useCallback(async () => {
        await request('/api/topic/delete', 'POST', { _id });
        close();
    }, [_id, close, request]);

    return (
        <ModalWindow>
            <h2 className={styles['delete-topic__label']}>
                {dataStore.labels.delete}
            </h2>
            <p className={styles['delete-topic__description']}>
                {dataStore.text.delete}
            </p>
            <div className={styles['delete-topic__buttons']}>
                <Button
                    skin="high"
                    color="red"
                    title={dataStore.buttons.delete}
                    disabled={loading}
                    onClick={deleteTopic}
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
