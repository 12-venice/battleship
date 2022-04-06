import { ChangeEventHandler, ErrorInfo, MouseEventHandler } from 'react';

export type OwnProps = {};

export type Props = {} & OwnProps;

export type State = {
    error: Error | null;
    errorInfo: ErrorInfo | null;
};

export type ButtonProps = {
    className?: string;
    title: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

export type inputProps = {
    type: string;
    title: string;
    value: string;
    setValid: Function;
    onChange: ChangeEventHandler<HTMLInputElement>;
};

export type formProps = {
    fields: { type: string; title: string }[];
    setData: Function;
    submit: JSX.Element;
};
