/* eslint-disable react/require-default-props */
import { CSSProperties } from 'react';
import background from '../../../images/background.svg';
import styles from './Layout.scss';
import leftImg from '../../../images/bg-left.png';
import rightImg from '../../../images/bg-right.png';

export const Layout = ({
    children,
    decor = true,
}: {
    children: React.ReactNode;
    decor?: boolean;
}): JSX.Element => {
    const vh =
        typeof window !== 'undefined' ? `${window.innerHeight / 100}px` : '1vh';
    return (
        <div
            className={styles.layout__background}
            style={
                {
                    // '--vh': vh,
                    backgroundImage: `url(${background})`,
                } as CSSProperties
            }
        >
            {decor && (
                <img
                    className={styles.layout__left}
                    src={leftImg}
                    alt="Кораблики"
                />
            )}
            {children}
            {decor && (
                <img
                    className={styles.layout__right}
                    src={rightImg}
                    alt="Кораблики"
                />
            )}
        </div>
    );
};
