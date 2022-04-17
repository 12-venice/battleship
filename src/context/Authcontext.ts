/* eslint-disable no-unused-expressions */
// Не понимаю как указать пусту функцию
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from 'react';

interface AuthContextType {
    user: {} | null;
    login: (from?: string) => void;
    logout: () => void;
    setUser: (value?: {}) => Dispatch<SetStateAction<{} | undefined>> | void;
}

export const AuthContext = createContext<AuthContextType>({
    user: {},
    login: () => {},
    logout: () => {},
    setUser: () => {},
});
