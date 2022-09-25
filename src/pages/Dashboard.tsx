import { useOutletContext } from 'react-router-dom';
import { useUserData } from '@nhost/react';
const Dashboard = () => {
  const user = useOutletContext<typeof useUserData>();

  return (
    <>
      <div>
        <h2>Dashboard</h2>

        {user !== null ? (
          <p>
            Welcome
            <span role="img">👋</span>
          </p>
        ) : (
          <p>User is null</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
