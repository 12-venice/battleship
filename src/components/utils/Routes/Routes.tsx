import { Route, Switch } from 'react-router-dom';
import { AuthPage } from 'src/pages/AuthPage';
import { ForumPage } from 'src/pages/ForumPage';
import { HomePage } from 'src/pages/HomePage';
import { NotFoundPage } from 'src/pages/NotFoundPage';

export const Routes = (): JSX.Element => (
    <Switch>
        <Route exact path="/">
            <HomePage />
        </Route>
        <Route exact path="/auth">
            <AuthPage />
        </Route>
        <Route exact path="/forum">
            <ForumPage />
        </Route>
        <Route>{NotFoundPage}</Route>
    </Switch>
);
