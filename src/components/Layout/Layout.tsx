import background from '../../../images/background.svg';
import styles from './Layout.scss';

export const Layout = ({
    children,
}: JSX.ElementChildrenAttribute): JSX.Element => (
    <div
        className={styles.layout__background}
        style={{
            backgroundImage: `url(${background})`,
        }}
    >
        {children}
    </div>
);
