import { useMessage } from 'src/hooks/message.hook';
import { Toast } from '../Toast';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { useRoutes } from '../utils/Routes';
import './App.scss';

export const App = (): JSX.Element => {
    const { list } = useMessage();
    console.log(list);
    const routes = useRoutes();
    const position = 'top-right';
    const autoDelete = true;
    const autoDeleteTime = 30000;

    return (
        <ErrorBoundary>
            <Toast
                toastList={list}
                position={position}
                autoDelete={autoDelete}
                autoDeleteTime={autoDeleteTime}
            />
            {routes}
        </ErrorBoundary>
    );
};
