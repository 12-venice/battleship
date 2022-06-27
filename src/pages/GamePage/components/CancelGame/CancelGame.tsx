import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';

import { PageLinks } from 'src/components/utils/Routes/types';
import { AllStateTypes } from 'src/store/reducers';
import styles from './CancelGame.scss';

export const CancelGame = (): JSX.Element => {
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    return (
        <ModalWindow>
            <p className={styles.cancelGame__text}>
                {dataStore.text.cancelGame}
            </p>
            <div className={styles.cancelGame__text}>
                <Button
                    skin="high"
                    title={dataStore.buttons.home}
                    color="green"
                    href={PageLinks.home}
                />
            </div>
        </ModalWindow>
    );
};
