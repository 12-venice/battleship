import { useEffect } from 'react';
import { useAuth } from 'src/hooks/auth.hook';
import background from '../../../images/background.svg';
import styles from './Layout.scss';

export const Layout = ({
    children,
}: JSX.ElementChildrenAttribute): JSX.Element => {
    const { login } = useAuth();
    useEffect(() => {
        login();
    }, [login]);
    return (
        <div
            className={styles.layout__background}
            style={{
                backgroundImage: `url(${background})`,
            }}
        >
            {children}
        </div>
    );
};
