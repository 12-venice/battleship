// @ts-nocheck
import { useSelector } from 'react-redux';
import { useHttp } from 'src/hooks/http.hook';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { AllStateTypes } from 'src/store/reducers';
import { gameService } from 'src/store/services/gameService';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLinks } from 'src/components/utils/Routes/types';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import { useContext } from 'react';
import styles from './CloseGameDialog.scss';

import { Props } from './types';

export const CloseGameDialog: Props = ({ close, gameStep }): JSX.Element => {
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const onlineGameID = useSelector((state: AllStateTypes) => state.game.id);
    const { room } = useParams() as { room: string };
    const thisUser = useSelector((state: AllStateTypes) => state.user.item);
    const { token } = useContext(AuthContext);
    const { request } = useHttp();
    const navigate = useNavigate();
    const fastExit = async () => {
        if (room === 'bot') {
            navigate(PageLinks.home);
        } else {
            const data = {
                gameId: onlineGameID,
                userId: thisUser?._id,
                gameStep,
            };
            await request('/api/game/exit', 'POST', data, {
                Authorization: `Bearer ${token}`,
            });
            gameService.finishGame();
            close();
        }
    };
    return (
        <ModalWindow>
            <p className={styles.closeGame__text}>{dataStore.text.closeGame}</p>
            <div className={styles.closeGame__buttons}>
                <Button
                    skin="high"
                    title={dataStore.buttons.back}
                    color="green"
                    onClick={close}
                />
                <Button
                    skin="high"
                    title={dataStore.buttons.close}
                    color="yellow"
                    onClick={() => fastExit()}
                />
            </div>
        </ModalWindow>
    );
};
