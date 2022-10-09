import { Link, useOutletContext } from 'react-router-dom';
import { Button, Container, Input, Loader, Title } from '@mantine/core';
import { LayoutContextType } from '../components/Layout';
import { useForm } from '@mantine/form';
import { useCreateCharacterMutation } from '../utils/__generated__/graphql';
import { showNotification } from '@mantine/notifications';

const Dashboard = () => {
  const { user } = useOutletContext<LayoutContextType>();
  const form = useForm({
    initialValues: { name: '' },
  });
  const [mutateCreateCharacter, { loading }] = useCreateCharacterMutation({
    refetchQueries: ['GetUser'],
  });

  const handleSubmit = async ({ name }: typeof form.values) => {
    try {
      await mutateCreateCharacter({
        variables: {
          name,
        },
      });
      showNotification({ message: 'Character creation successful' });
    } catch (error) {
      showNotification({ message: 'Character creation error' });
    }
  };
  return (
    <Container>
      <Title>{user?.displayName} Dashboard</Title>
      <ul>
        {user.characters.map(({ id, name }) => (
          <li key={id}>
            <Link to={id.toString()}>{name}</Link>{' '}
          </li>
        ))}
      </ul>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Input
          placeholder="New character name"
          {...form.getInputProps('name')}
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Create a character'}
        </Button>
      </form>
    </Container>
  );
};

export default Dashboard;
