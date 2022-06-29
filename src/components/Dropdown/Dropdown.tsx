// @ts-nocheck
import cn from 'classnames';
import { useState } from 'react';
import { Button } from '../Button';
import styles from './Dropdown.scss';

export const Dropdown = (): JSX.Element => {
    const [isActive, setIsActive] = useState(false);
    return (
        <div className={styles.dropdown12}>
            {isActive && (
                <div className={styles['dropdown-content12']}>
                    <Button title={'\u{1F642}'} skin="quad" color="blue" />
                    <Button title={'\u{1F642}'} skin="quad" color="green" />
                    <Button title={'\u{1F642}'} skin="quad" />
                </div>
            )}
            <Button
                title={'\u{1F642}'}
                skin="quad"
                color="blue"
                onClick={() => setIsActive(!isActive)}
            />
        </div>
    );
};
