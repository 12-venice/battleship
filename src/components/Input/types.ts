import { ChangeEventHandler } from 'react';

export type inputProps = {
    type: string;
    title: string;
    value: string;
    setValid: () => void;
    onChange: ChangeEventHandler<HTMLInputElement>;
};
