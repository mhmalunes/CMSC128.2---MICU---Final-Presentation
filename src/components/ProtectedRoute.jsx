import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';

const ProtectedRoute = ({ roles, children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    const redirect = user.role === 'admin' ? '/admin' : user.role === 'nurse' ? '/nurse' : '/doctor';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default ProtectedRoute;

