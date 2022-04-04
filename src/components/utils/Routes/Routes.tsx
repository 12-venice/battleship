import { Route, Switch } from 'react-router-dom';
import { HomePage } from 'src/pages/HomePage';
import { NotFoundPage } from 'src/pages/NotFoundPage';

export const Routes = (): JSX.Element => (
    <Switch>
        <Route exact path="/">
            <HomePage />
        </Route>
        <Route>
            <NotFoundPage />
        </Route>
    </Switch>
);
