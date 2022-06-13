import { FC } from 'react';

type EndGameProps = {
    screen: 'victory' | 'defeat';
    room: string;
    gameStatistics: any[];
    gameAccount: number[];
};

export type Props = FC<EndGameProps>;
