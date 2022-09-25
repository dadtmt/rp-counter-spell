import { useOutletContext } from 'react-router-dom';
import { Container, Title } from '@mantine/core';
import { LayoutContextType } from '../components/Layout';
const Dashboard = () => {
  const { user } = useOutletContext<LayoutContextType>();

  return (
    <Container>
      <Title>{user?.displayName} Dashboard</Title>
    </Container>
  );
};

export default Dashboard;
