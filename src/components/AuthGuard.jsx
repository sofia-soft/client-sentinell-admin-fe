import { Navigate, Outlet } from 'react-router-dom';

export const AuthGuard = ({ isAllowed, redirectPath = '/login' }) => {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
};