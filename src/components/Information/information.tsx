// @ts-nocheck
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { AllStateTypes } from 'src/store/reducers';
import styles from './information.scss';
import { Props } from './types';

export const Information: Props = ({ close }): JSX.Element => {
    const data = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    return (
        <ModalWindow>
            <h2 className={styles.information__label}>
                {data.labels.information}
            </h2>
            <p className={styles.information__description}>
                {data.text.information}
            </p>
            <Button
                skin="high"
                color="green"
                title={data.buttons.back}
                onClick={close}
            />
        </ModalWindow>
    );
};
