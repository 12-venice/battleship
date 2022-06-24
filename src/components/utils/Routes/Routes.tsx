import { Route, Navigate, Routes, useLocation } from 'react-router-dom';
import { AuthPage } from 'src/pages/AuthPage';
import { HomePage } from 'src/pages/HomePage';
import { NotFoundPage } from 'src/pages/NotFoundPage';
import { ProfilePage } from 'src/pages/ProfilePage';
import { RegisterPage } from 'src/pages/RegisterPage';
import { UpdatePassPage } from 'src/pages/UpdatePassPage';
import { LeaderPage } from 'src/pages/LeaderPage';
import { ForumPage } from 'src/pages/ForumPage';
import { UpdateProfilePage } from 'src/pages/UpdateProfilePage';
import { GamePage } from 'src/pages/GamePage';
import { FinderPage } from 'src/pages/FinderPage';
import { ChatsPage } from 'src/pages/ChatsPage';
import { Chat } from 'src/components/Chat';
import { useContext } from 'react';
import { PageLinks, Props } from './types';
import { AuthContext } from '../Context/AuthContext';

const ProtectedRoute: Props = ({ childrens }) => {
    const { token } = useContext(AuthContext);
    const location = useLocation();
    if (!token && typeof window !== 'undefined') {
        return (
            <Navigate to={PageLinks.auth} state={{ from: location }} replace />
        );
    }
    return childrens;
};

export const useRoutes = (): JSX.Element => (
    <Routes>
        <Route path={PageLinks.home} element={<HomePage />} />
        <Route path={PageLinks.auth} element={<AuthPage />} />
        <Route path={PageLinks.leaderboard} element={<LeaderPage />} />
        <Route path={PageLinks.register} element={<RegisterPage />} />
        <Route
            path={PageLinks.profile}
            element={<ProtectedRoute childrens={<ProfilePage />} />}
        />
        <Route
            path={PageLinks.profilePassUpdate}
            element={<UpdatePassPage />}
        />
        <Route path={PageLinks.profileUpdate} element={<UpdateProfilePage />} />
        <Route path={PageLinks.forum} element={<ForumPage />} />
        <Route
            path={`${PageLinks.game}/:room`}
            element={<ProtectedRoute childrens={<GamePage />} />}
        />
        <Route
            path={PageLinks.finder}
            element={<ProtectedRoute childrens={<FinderPage />} />}
        />
        <Route
            path={PageLinks.chats}
            element={<ProtectedRoute childrens={<ChatsPage />} />}
        >
            <Route path=":room" element={<Chat videoCall={false} />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);
