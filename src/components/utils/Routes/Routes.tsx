import { Route, Switch } from 'react-router-dom';
import { AuthPage } from 'src/pages/AuthPage';
import { ForumPage } from 'src/pages/ForumPage';
import { HomePage } from 'src/pages/HomePage';
import { NotFoundPage } from 'src/pages/NotFoundPage';
import { ProfilePage } from 'src/pages/ProfilePage';
import { RegisterPage } from 'src/pages/RegisterPage';
import { Area } from 'src/pages/GamePage/components/Area';
import { useContext } from 'react';
import { AuthContext } from 'src/context/Authcontext';
import { ChangePassPage } from 'src/pages/ProfilePage/Components/ChangePass';
import { EditProfilePage } from 'src/pages/ProfilePage/Components/EditProfile';
import { PageLinks } from './types';

export const Routes = (): JSX.Element => {
    const { isAuth } = useContext(AuthContext);
    return (
        <Switch>
            <Route exact path={PageLinks.home}>
                <HomePage />
            </Route>
            <Route exact path={PageLinks.auth}>
                <AuthPage />
            </Route>
            <Route exact path={PageLinks.register}>
                <RegisterPage />
            </Route>
            {isAuth && (
                <Route exact path={PageLinks.profile}>
                    <ProfilePage />
                </Route>
            )}
            <Route exact path={PageLinks.profilePassUpdate}>
                <ChangePassPage />
            </Route>
            <Route exact path={PageLinks.forum}>
                <ForumPage />
            </Route>
            <Route exact path={PageLinks.profileUpdate}>
                <EditProfilePage />
            </Route>
            {isAuth && (
                <Route exact path={PageLinks.game}>
                    <Area areaWidth={300} fillColor="#9DC0F0" />
                </Route>
            )}
            <Route>{NotFoundPage}</Route>
        </Switch>
    );
};
