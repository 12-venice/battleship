import { RouteComponentProps } from 'react-router-dom';

export const enum PageLinks {
    home = '/',
    auth = '/auth',
    game = '/battleship',
    register = '/register',
    profile = '/profile',
}

export interface MatchParams {
    name: string;
    id: string;
}

export type MatchProps = RouteComponentProps<MatchParams>;
