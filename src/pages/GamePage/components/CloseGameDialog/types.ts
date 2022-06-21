import { FC } from 'react';

type CloseGameProps = {
    close?: () => void;
    gameStep: number;
};

export type Props = FC<CloseGameProps>;
