import { ErrorInfo } from 'react';

export type OwnProps = {};

export type Props = {} & OwnProps;

export type State = {
    error: Error | null;
    errorInfo: ErrorInfo | null;
};