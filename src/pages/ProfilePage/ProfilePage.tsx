import { Generator } from 'src/components/utils/GenerateAvatar';
import { Layout } from '../../components/Layout';

export const ProfilePage = (): JSX.Element => {
    const user = {
        login: 'DRZ',
        first_name: 'Andrey',
        second_name: 'Sharov',
        email: 'drzz@dd.ru',
        phone: '89151437599',
    };
    return (
        <Layout>
            <div className="profile__main">
                <div className="profile__block">
                    {Generator(user)}
                    <p>{user.login}</p>
                    <p>{user.first_name}</p>
                    <p>{user.second_name}</p>
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                </div>
            </div>
        </Layout>
    );
};
