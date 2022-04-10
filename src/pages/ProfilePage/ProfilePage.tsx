import { NavLink } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Layout } from '../../components/Layout';
import styles from './ProfilePage.scss';

export const ProfilePage = (): JSX.Element => {
    const user = {
        login: 'DRZ',
        first_name: 'Ivan',
        second_name: 'Ivanov',
        email: 'drzz@dd.ru',
        phone: '89101112233',
    };
    return (
        <Layout>
            <div className={styles.profile__main}>
                <div className={styles['profile__block-up']}>
                    <NavLink to="/">
                        <Button className="red" title="x" />
                    </NavLink>
                </div>
                <div className={styles['profile__block-center']}>
                    <div className={styles.profile__avatar}>
                        {user.login[0]}
                    </div>
                    <span>{user.login}</span>
                    <span>{user.first_name}</span>
                    <span>{user.second_name}</span>
                    <span>{user.email}</span>
                    <span>{user.phone}</span>
                </div>
                <div className={styles['profile__block-down']}>
                    <Button title="edit profile" />
                    <Button title="edit password" />
                </div>
            </div>
        </Layout>
    );
};
