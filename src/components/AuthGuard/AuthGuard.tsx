import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../api/auth';

interface AuthGuardProps {
  redirectTo?: string;
}

const AuthGuard = ({ redirectTo = '/login' }: AuthGuardProps) => {
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default AuthGuard; 