import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';

import { useCallback } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import { Props } from './types';

import styles from './deleteTopic.scss';

export const DeleteTopicWindow: Props = ({ close, _id }): JSX.Element => {
    const { request, loading } = useHttp();
    const deleteTopic = useCallback(async () => {
        await request('/api/topic/delete', 'POST', { _id }, {}, true);
        close();
    }, [_id, close, request]);

    return (
        <ModalWindow>
            <h2 className={styles['delete-topic__label']}>Delete TOPIC</h2>
            <p className={styles['delete-topic__description']}>
                Do you want to delete the topic?
            </p>
            <div className={styles['delete-topic__buttons']}>
                <Button
                    skin="high"
                    color="red"
                    title="DELETE"
                    disabled={loading}
                    onClick={deleteTopic}
                />
                <Button
                    skin="high"
                    color="green"
                    title="BACK"
                    onClick={close}
                />
            </div>
        </ModalWindow>
    );
};
