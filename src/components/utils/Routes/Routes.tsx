import { Route, Switch, Redirect } from 'react-router-dom';
import { AuthPage } from 'src/pages/AuthPage';
import { HomePage } from 'src/pages/HomePage';
import { NotFoundPage } from 'src/pages/NotFoundPage';
import { ProfilePage } from 'src/pages/ProfilePage';
import { RegisterPage } from 'src/pages/RegisterPage';
import { UpdatePassPage } from 'src/pages/UpdatePassPage';
import { LeaderPage } from 'src/pages/LeaderPage';
import { ForumPage } from 'src/pages/ForumPage';
import { UpdateProfilePage } from 'src/pages/UpdateProfilePage';
import { GamePage } from 'src/pages/GamePage';
import { useContext } from 'react';
import { AuthContext } from 'src/context/Authcontext';
import { PageLinks, Props } from './types';

const ProtectedRoute: Props = ({ children, isAuth }) => {
    if (!isAuth) {
        return <Redirect to={PageLinks.auth} />;
    }
    return children;
};

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
            <Route exact path={PageLinks.profile}>
                <ProtectedRoute isAuth={isAuth}>
                    <ProfilePage />
                </ProtectedRoute>
            </Route>
            <Route exact path={PageLinks.profilePassUpdate}>
                <UpdatePassPage />
            </Route>
            <Route exact path={PageLinks.profileUpdate}>
                <UpdateProfilePage />
            </Route>
            <Route exact path={PageLinks.forum}>
                <ForumPage />
            </Route>
            <Route exact path={PageLinks.game}>
                <ProtectedRoute isAuth={isAuth}>
                    <GamePage />
                </ProtectedRoute>
            </Route>
            <Route>{NotFoundPage}</Route>
        </Switch>
    );
};
