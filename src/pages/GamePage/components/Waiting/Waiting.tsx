// @ts-nocheck
import { useSelector } from 'react-redux';
import { ModalWindow } from 'src/components/ModalWindow';
import { Preloader } from 'src/components/Preloader';
import { AllStateTypes } from 'src/store/reducers';

import styles from './Waiting.scss';

export const Waiting = (): JSX.Element => {
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    return (
        <ModalWindow>
            <p className={styles.waiting__text}>{dataStore.text.waiting}</p>
            <Preloader />
        </ModalWindow>
    );
};
