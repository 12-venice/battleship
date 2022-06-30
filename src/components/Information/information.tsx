// @ts-nocheck
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { AllStateTypes } from 'src/store/reducers';
import infoAuth from '../../../images/infoAuth.png';
import infoFind from '../../../images/infoFind.png';
import infoStart from '../../../images/infoStart.png';
import infoSwitch from '../../../images/infoSwitch.png';

import styles from './information.scss';
import { Props } from './types';

export const Information: Props = ({ close }): JSX.Element => {
    const data = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    return (
        <ModalWindow>
            <div className={styles.information__block}>
                <h2 className={styles.information__label}>
                    {data.labels.information}
                </h2>
                <p className={styles.information__description}>
                    {data.text.information1}
                </p>
                <h2 className={styles.information__label}>
                    {data.text.information2}
                </h2>
                <p className={styles.information__description}>
                    {data.text.information3}
                </p>
                <p className={styles.information__description}>
                    {data.text.information4}
                </p>
                <h2 className={styles.information__label}>
                    {data.text.information5}
                </h2>
                <p className={styles.information__description}>
                    {data.text.information6}
                </p>
                <img
                    className={styles.information__img}
                    src={infoAuth}
                    alt="Как авторизироваться"
                />
                <p className={styles.information__description}>
                    {data.text.information7}
                </p>
                <p className={styles.information__description}>
                    {data.text.information8}
                </p>
                <img
                    className={styles.information__img}
                    src={infoFind}
                    alt="Как найти соперника"
                />
                <p className={styles.information__description}>
                    {data.text.information9}
                </p>
                <p className={styles.information__description}>
                    {data.text.information10}
                </p>
                <h2 className={styles.information__label}>
                    {data.text.information11}
                </h2>
                <p className={styles.information__description}>
                    {data.text.information12}
                </p>
                <img
                    className={styles.information__img}
                    src={infoStart}
                    alt="Как расставить корабли"
                />
                <p className={styles.information__description}>
                    {data.text.information13}
                </p>
                <p className={styles.information__description}>
                    {data.text.information14}
                </p>
                <p className={styles.information__description}>
                    {data.text.information15}
                </p>
                <img
                    className={styles.information__img}
                    src={infoSwitch}
                    alt="Как расставить корабли"
                />
                <p className={styles.information__description}>
                    {data.text.information16}
                </p>
                <p className={styles.information__description}>
                    {data.text.information17}
                </p>
                <h2 className={styles.information__label}>
                    {data.text.information18}
                </h2>
                <p className={styles.information__description}>
                    {data.text.information19}
                </p>
                <p className={styles.information__description}>
                    {data.text.information20}
                </p>
                <p className={styles.information__description}>
                    {data.text.information21}
                </p>
                <p className={styles.information__description}>
                    {data.text.information22}
                </p>
                <p className={styles.information__description}>
                    {data.text.information23}
                </p>
                <p className={styles.information__description}>
                    {data.text.information24}
                </p>
                <div className={styles.information__footer}>
                    <Button
                        skin="high"
                        color="green"
                        title={data.buttons.back}
                        onClick={close}
                    />
                </div>
            </div>
        </ModalWindow>
    );
};
