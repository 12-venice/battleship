import { ChangeEventHandler, ErrorInfo } from 'react';

export type OwnProps = {};

export type Props = {} & OwnProps;

export type State = {
    error: Error | null;
    errorInfo: ErrorInfo | null;
};

export type ButtonProps = {
    className?: string;
    title: string;
};

export type inputProps = {
    value: string;
    name: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    title: string;
};

export type formProps = {
    form: {};
    setForm: Function;
    childrensUp: JSX.Element;
    childrensDown: JSX.Element;
};
