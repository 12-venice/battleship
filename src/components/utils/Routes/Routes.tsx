import { Route, Navigate, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { AllStateTypes } from 'src/store/reducers';
import { PageLinks, Props } from './types';

const ProtectedRoute: Props = ({ childrens }) => {
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const location = useLocation();
    if (!user) {
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
            path={PageLinks.game}
            element={<ProtectedRoute childrens={<GamePage />} />}
        />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);
