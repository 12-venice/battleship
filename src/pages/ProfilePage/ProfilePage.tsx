import { Button } from 'src/components/Button';
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
                <div className="profile__block-up">
                    <Button className="red" title="x" />
                </div>
                <div className="profile__block-center">
                    <div className="profile__avatar">{user.login[0]}</div>
                    <span>{user.login}</span>
                    <span>{user.first_name}</span>
                    <span>{user.second_name}</span>
                    <span>{user.email}</span>
                    <span>{user.phone}</span>
                </div>
                <div className="profile__block-down">
                    <Button title="edit profile" />
                    <Button title="edit password" />
                </div>
            </div>
        </Layout>
    );
};
