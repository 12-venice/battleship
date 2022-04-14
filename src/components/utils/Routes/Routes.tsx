import { Route, Switch } from 'react-router-dom';
import { AuthPage } from 'src/pages/AuthPage';
import { ForumPage } from 'src/pages/ForumPage';
import { HomePage } from 'src/pages/HomePage';
import { NotFoundPage } from 'src/pages/NotFoundPage';
import { ProfilePage } from 'src/pages/ProfilePage';
import { RegisterPage } from 'src/pages/RegisterPage';
import { Button } from 'src/components/Button';
import { PageLinks } from './types';

export const Routes = (): JSX.Element => (
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
        <Route exact path={PageLinks.profile}>
            <ProfilePage />
        </Route>
        <Route exact path={PageLinks.forum}>
            <ForumPage />
        </Route>
        <Route exact path="/btn">
            <Button title="SIGN IN!" skin="wide" />
            <Button title="SEND" skin="short" />
            <Button title="RESET" skin="short" color="green" />
            <Button title="LEADERS" skin="regular" />
            <Button title="FORUM" color="yellow" />
            <Button title="X" skin="quad" color="red" />
            <Button title="i" skin="quad" />
            <Button title="PLAY!" skin="large" color="green" disabled />
            <Button title="CLOSE" skin="high" color="yellow" />
            <Button title="LOG OUT" skin="auth" color="blue" />
            <Button title="LOG IN" skin="auth" noFill />
        </Route>
        <Route>{NotFoundPage}</Route>
    </Switch>
);
