import { Button } from 'src/components/Button';
import { useContext, useState } from 'react';
import { AuthContext } from 'src/context/Authcontext';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Layout } from '../../components/Layout';
import styles from './ProfilePage.scss';
import { Avatar } from './components/Avatar';
import { UpdateAvatar } from './components/UpdateAvatar';

export const ProfilePage = (): JSX.Element => {
    const { user } = useContext(AuthContext);
    const [updateAvatar, setUpdateAvatar] = useState(false);
    const getUpdateAvatar = () => setUpdateAvatar(!updateAvatar);

    return (
        <Layout>
            <div className={styles.profile__main}>
                <div className={styles['profile__block-up']}>
                    <Button
                        href={PageLinks.home}
                        skin="quad"
                        color="red"
                        title="X"
                    />
                </div>
                <div className={styles['profile__block-center']}>
                    {Avatar(user, getUpdateAvatar)}
                    <span>{user.display_name}</span>
                    <span>{user.first_name}</span>
                    <span>{user.second_name}</span>
                    <span>{user.login}</span>
                    <span>{user.email}</span>
                    <span>{user.phone}</span>
                </div>
                <div className={styles['profile__block-down']}>
                    <Button
                        href={PageLinks.profileUpdate}
                        title="EDIT PROFILE"
                        skin="wide"
                    />
                    <Button
                        href={PageLinks.profilePassUpdate}
                        title="EDIT PASSWORD"
                        skin="wide"
                    />
                </div>
            </div>
            {updateAvatar && <UpdateAvatar close={getUpdateAvatar} />}
        </Layout>
    );
};
