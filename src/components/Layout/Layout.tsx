/* eslint-disable react/require-default-props */
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
}): JSX.Element => (
    <div
        className={styles.layout__background}
        style={{
            backgroundImage: `url(${background})`,
        }}
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
