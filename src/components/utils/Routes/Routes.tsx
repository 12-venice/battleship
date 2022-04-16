import { Route, Switch } from 'react-router-dom';
import { AuthPage } from 'src/pages/AuthPage';
import { HomePage } from 'src/pages/HomePage';
import { NotFoundPage } from 'src/pages/NotFoundPage';
import { ProfilePage } from 'src/pages/ProfilePage';
import { RegisterPage } from 'src/pages/RegisterPage';
import { Area } from 'src/pages/GamePage/components/Area';
import { useContext } from 'react';
import { AuthContext } from 'src/context/Authcontext';
import { UpdatePassPage } from 'src/pages/UpdatePassPage';
import { LeaderPage } from 'src/pages/LeaderPage';
import { ForumPage } from 'src/pages/ForumPage';
import { UpdateProfilePage } from 'src/pages/UpdateProfilePage';
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
            <Route exact path={PageLinks.leaderboard}>
                <LeaderPage />
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
                <UpdatePassPage />
            </Route>
            <Route exact path={PageLinks.profileUpdate}>
                <UpdateProfilePage />
            </Route>
            <Route exact path={PageLinks.forum}>
                <ForumPage />
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
