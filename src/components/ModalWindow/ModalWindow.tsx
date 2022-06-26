// @ts-nocheck
import cn from 'classnames';
import styles from './ModalWindow.scss';

import { Props } from './types';

export const ModalWindow: Props = ({ children, noBackground }): JSX.Element => (
    <div className={styles.modal__background}>
        <div
            className={cn(
                styles.modal__plate,
                noBackground && styles['modal__plate-no-bg'],
            )}
        >
            {children}
        </div>
    </div>
);
