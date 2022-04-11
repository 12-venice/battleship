import { Route, Switch } from 'react-router-dom';
import { AuthPage } from 'src/pages/AuthPage';
import { HomePage } from 'src/pages/HomePage';
import { NotFoundPage } from 'src/pages/NotFoundPage';
import { ProfilePage } from 'src/pages/ProfilePage';
import { RegisterPage } from 'src/pages/RegisterPage';

export const Routes = (): JSX.Element => (
    <Switch>
        <Route exact path="/">
            <HomePage />
        </Route>
        <Route exact path="/auth">
            <AuthPage />
        </Route>
        <Route exact path="/register">
            <RegisterPage />
        </Route>
        <Route exact path="/profile">
            <ProfilePage />
        </Route>
        <Route>{NotFoundPage}</Route>
    </Switch>
);
