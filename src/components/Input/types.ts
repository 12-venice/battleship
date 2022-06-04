import { ChangeEventHandler } from 'react';

export type inputProps = {
    type?: string;
    title?: string;
    defaultValue?: string | number;
    name: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    className?: string;
    validateMsgFalse?: string;
};
