import { FC, ReactElement } from 'react';

export const enum PageLinks {
    home = '/',
    auth = '/auth',
    game = '/battleship',
    register = '/register',
    profile = '/profile',
    profileUpdate = '/profileupdate',
    profilePassUpdate = '/passupdate',
    forum = '/forum',
    leaderboard = '/leaderboard',
}

type RouteProps = {
    childrens: ReactElement;
};
export type Props = FC<RouteProps>;

export type FromProps = {
    from: { pathname: string };
};
