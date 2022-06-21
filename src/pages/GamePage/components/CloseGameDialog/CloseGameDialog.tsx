import { useSelector } from 'react-redux';
import { useAuth } from 'src/hooks/auth.hook';
import { useHttp } from 'src/hooks/http.hook';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { AllStateTypes } from 'src/store/reducers';
import { gameService } from 'src/store/services/gameService';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLinks } from 'src/components/utils/Routes/types';
import styles from './CloseGameDialog.scss';

import { Props } from './types';

export const CloseGameDialog: Props = ({ close, gameStep }): JSX.Element => {
    const onlineGameID = useSelector((state: AllStateTypes) => state.game.id);
    const { room } = useParams() as { room: string };
    const thisUser = useSelector((state: AllStateTypes) => state.user.item);
    const { token } = useAuth();
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
                    onClick={() => fastExit()}
                />
            </div>
        </ModalWindow>
    );
};
