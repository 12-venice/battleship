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
    children: ReactElement;
    isAuth: boolean;
};
export type Props = FC<RouteProps>;
