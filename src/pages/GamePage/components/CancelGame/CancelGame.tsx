import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';

import { PageLinks } from 'src/components/utils/Routes/types';
import styles from './CancelGame.scss';

export const CancelGame = (): JSX.Element => (
    <ModalWindow>
        <p className={styles.cancelGame__text}>The game was canceled</p>
        <div className={styles.cancelGame__text}>
            <Button
                skin="high"
                title="HOME"
                color="green"
                href={PageLinks.home}
            />
        </div>
    </ModalWindow>
);
