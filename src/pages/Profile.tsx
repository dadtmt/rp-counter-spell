import { useOutletContext } from 'react-router-dom';
import { LayoutContextType } from '../components/Layout';

const Profile = () => {
  const { user } = useOutletContext<LayoutContextType>();
  return <p>profile of {user?.displayName}</p>;
};

export default Profile;
