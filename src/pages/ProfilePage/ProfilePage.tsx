import { useHistory } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { useContext } from 'react';
import cn from 'classnames';
import { AuthContext } from 'src/context/Authcontext';
import { Layout } from '../../components/Layout';
import styles from './ProfilePage.scss';
import stylesButton from '../../components/Button/Button.scss';
import { Avatar } from './Avatar';

export const ProfilePage = (): JSX.Element => {
    const history = useHistory();
    const { user } = useContext(AuthContext);

    return (
        <Layout>
            <div className={styles.profile__main}>
                <div className={styles['profile__block-up']}>
                    <Button
                        onClick={() => {
                            history.push('/');
                        }}
                        className={cn(stylesButton.red, stylesButton.slim)}
                        title="X"
                    />
                </div>
                <div className={styles['profile__block-center']}>
                    {Avatar(user)}
                    <span>{user.display_name}</span>
                    <span>{user.first_name}</span>
                    <span>{user.second_name}</span>
                    <span>{user.login}</span>
                    <span>{user.email}</span>
                    <span>{user.phone}</span>
                </div>
                <div className={styles['profile__block-down']}>
                    <Button
                        onClick={() => {
                            history.push('/profileupdate');
                        }}
                        title="edit profile"
                        className={stylesButton.wide}
                    />
                    <Button
                        onClick={() => {
                            history.push('/passupdate');
                        }}
                        title="edit password"
                        className={stylesButton.wide}
                    />
                </div>
            </div>
        </Layout>
    );
};
