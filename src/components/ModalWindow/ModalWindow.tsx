import styles from './ModalWindow.scss';

import { Props } from './types';

export const ModalWindow: Props = ({ children, background }): JSX.Element => (
    <div className={styles.modal__background}>
        <div
            className={`${background && styles.modal__plate} ${
                styles['modal__plate-no-bg']
            }`}
        >
            {children}
        </div>
    </div>
);
