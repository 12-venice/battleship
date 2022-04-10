import { FC } from "react";

type EndGameProps = {
    screen: 'victory' | 'defeat';
    callback: () => void;
};

export type Props = FC<EndGameProps>; 