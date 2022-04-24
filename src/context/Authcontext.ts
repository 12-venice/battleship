import { createContext, Dispatch, SetStateAction } from 'react';

export type User = {
    id?: number;
    avatar?: string;
    first_name?: string;
    second_name?: string;
    display_name?: string;
    email?: string;
    login?: string;
    phone?: string;
};

interface AuthContextType {
    user: User;
    login: (from?: string) => void;
    logout: () => void;
    setUser: (value?: {}) => Dispatch<SetStateAction<{} | undefined>> | void;
}

const emptyFunction = () => {
    // do nothing.
};

export const AuthContext = createContext<AuthContextType>({
    user: {},
    login: emptyFunction,
    logout: emptyFunction,
    setUser: emptyFunction,
});
