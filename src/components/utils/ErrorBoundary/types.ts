import { ErrorInfo } from 'react';

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
    className?: string;
    title: string;
};

export type formProps = {
    inputs: inputProps[];
    childrensUp: JSX.Element;
    childrensDown: JSX.Element;
};
