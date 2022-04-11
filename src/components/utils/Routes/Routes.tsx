import { Route, Switch } from 'react-router-dom';
import { AuthPage } from 'src/pages/AuthPage';
import { HomePage } from 'src/pages/HomePage';
import { NotFoundPage } from 'src/pages/NotFoundPage';
import { ProfilePage } from 'src/pages/ProfilePage';
import { RegisterPage } from 'src/pages/RegisterPage';
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
        <Route>{NotFoundPage}</Route>
    </Switch>
);
