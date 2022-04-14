/// Ошибка деструктуризации
/* eslint-disable object-curly-newline */
import { useMemo } from 'react';
import { AuthContext } from 'src/context/Authcontext';
import { useAuth } from 'src/hooks/auth.hook';
import { Routes } from '../utils/Routes/Routes';
import './App.scss';

export const App = (): JSX.Element => {
    const { login, logout, isAuth, user, setUser } = useAuth();
    const appDataProviderValue = useMemo(
        () => ({
            login,
            logout,
            isAuth,
            user,
            setUser,
        }),
        [login, logout, isAuth, user, setUser],
    );

    return (
        <AuthContext.Provider value={appDataProviderValue}>
            <Routes />
        </AuthContext.Provider>
    );
};
