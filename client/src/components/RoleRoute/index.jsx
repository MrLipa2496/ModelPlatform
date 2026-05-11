import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spiner from '../Spinner';

const RoleRoute = ({ allowedRoles }) => {
  const { user, isFetching } = useSelector(state => state.auth || {});

  if (isFetching) {
    return <Spiner />;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
