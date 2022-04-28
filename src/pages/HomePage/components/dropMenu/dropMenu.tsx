import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { AllStateTypes } from 'src/store/reducers';
import styles from './dropMenu.scss';
import { Props } from './types';

export const DropMenu: Props = ({ close, children }): JSX.Element => {
    const data = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    return (
        <ModalWindow>
            <h2 className={styles['drop-menu__label']}>{data.labels.menu}</h2>
            {children}
            <Button
                skin="high"
                color="green"
                title={data.buttons.back}
                onClick={close}
            />
        </ModalWindow>
    );
};
