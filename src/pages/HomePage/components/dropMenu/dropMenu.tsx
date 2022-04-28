import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import styles from './dropMenu.scss';
import { Props } from './types';

export const DropMenu: Props = ({ close, children }): JSX.Element => (
    <ModalWindow>
        <h2 className={styles['drop-menu__label']}>MENU</h2>
        {children}
        <Button skin="high" color="green" title="BACK" onClick={close} />
    </ModalWindow>
);
