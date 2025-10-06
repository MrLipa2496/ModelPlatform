import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spiner from '../../Spinner/Spinner';

const RoleRoute = ({ allowedRoles }) => {
  const { data: user, isFetching } = useSelector(state => state.userStore);

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
