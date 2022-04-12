import { NavLink } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useEffect, useState } from 'react';
import { MatchProps } from 'src/components/utils/Routes/types';
import { Layout } from '../../components/Layout';
import styles from './ProfilePage.scss';
import stylesButton from '../../components/Button/Button.scss';

export const ProfilePage = ({ match }: MatchProps): JSX.Element => {
    const { id } = match.params;
    const { request, loading } = useHttp();
    const [user, setUser] = useState({
        id: '',
        first_name: '',
        second_name: '',
        display_name: '',
        login: '',
        email: '',
        phone: '',
        avatar: '',
    });
    const getUser = useCallback(async () => {
        try {
            const fetched = await request(`/auth/user/${id}`, 'GET', null);
            setUser(fetched);
        } catch (e) {
            throw new SyntaxError('Что-то пошло не так');
        }
    }, [id, request]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    if (loading) {
        return <div>Компонент ЛОАДЕР</div>;
    }

    console.log(user);

    return (
        <Layout>
            <div className={styles.profile__main}>
                <div className={styles['profile__block-up']}>
                    <NavLink to="/">
                        <Button className={stylesButton.red} title="X" />
                    </NavLink>
                </div>
                <div className={styles['profile__block-center']}>
                    <div className={styles.profile__avatar}>
                        {user.login[0]}
                    </div>
                    <span>{user.display_name}</span>
                    <span>{user.first_name}</span>
                    <span>{user.second_name}</span>
                    <span>{user.login}</span>
                    <span>{user.email}</span>
                    <span>{user.phone}</span>
                </div>
                <div className={styles['profile__block-down']}>
                    <Button
                        title="edit profile"
                        className={stylesButton.wide}
                    />
                    <Button
                        title="edit password"
                        className={stylesButton.wide}
                    />
                </div>
            </div>
        </Layout>
    );
};
