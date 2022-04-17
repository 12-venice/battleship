import { useAuth } from 'src/hooks/auth.hook';
import { AuthContext } from './Authcontext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const value = useAuth();
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
