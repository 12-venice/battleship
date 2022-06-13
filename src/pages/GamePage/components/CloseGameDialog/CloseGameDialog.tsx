import { useNavigate } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';

import styles from './CloseGameDialog.scss';

import { Props } from './types';

export const CloseGameDialog: Props = ({ close }): JSX.Element => {
    const navigate = useNavigate();
    return (
        <ModalWindow>
            <p className={styles.closeGame__text}>
                Do you want to close the game?
            </p>
            <div className={styles.closeGame__buttons}>
                <Button
                    skin="high"
                    title="BACK"
                    color="green"
                    onClick={close}
                />
                <Button
                    skin="high"
                    title="CLOSE"
                    color="yellow"
                    onClick={() => navigate(-1)}
                />
            </div>
        </ModalWindow>
    );
};
