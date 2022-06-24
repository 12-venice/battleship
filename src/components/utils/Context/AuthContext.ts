/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

type noopFunction = (jwtToken?: string, from?: string) => void;

const noop = () => {};

export const AuthContext = createContext({
    token: null,
    login: noop() as unknown as noopFunction,
    logout: noop() as unknown as noopFunction,
});
