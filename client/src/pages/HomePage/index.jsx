import { useSelector } from 'react-redux';
import GuestHome from '../GuestPages/GuestHome';
import ModelHome from '../ModelPages/ModelHome';
import AgencyHome from '../AgencyPages/AgencyHome';

export default function HomePage () {
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return <GuestHome />;
  }
  const userRole = (user.role || user.USR_Role || '').toLowerCase();

  if (userRole === 'model') {
    return <ModelHome />;
  }

  if (userRole === 'agency') {
    return <AgencyHome />;
  }

  return <GuestHome />;
}
