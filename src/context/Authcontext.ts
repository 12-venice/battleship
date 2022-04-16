/* eslint-disable no-unused-expressions */
// Не понимаю как указать пусту функцию
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

export const AuthContext = createContext({
    login: (): void => {},
    logout: (): void => {},
    setUser: (): void => {},
    isAuth: false,
    user: {
        id: '',
        first_name: '',
        second_name: '',
        display_name: '',
        login: '',
        email: '',
        phone: '',
        avatar: '',
    },
});
