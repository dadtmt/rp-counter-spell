import { Link, useOutletContext } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Loader,
  Text,
  TextInput,
} from '@mantine/core';
import { LayoutContextType, useTitle } from '../components/Layout';
import { useForm } from '@mantine/form';
import { useCreateCharacterMutation } from '../utils/__generated__/graphql';
import { showNotification } from '@mantine/notifications';

const Dashboard = () => {
  const { user } = useOutletContext<LayoutContextType>();
  useTitle(`${user?.displayName} Characters`);
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
      {user.characters.map(({ id, name, counters }) => (
        <Card key={id} shadow="sm" p="lg" radius="md" withBorder mt="xl">
          <Group position="apart">
            <Text size="xl" style={{ flexGrow: 1 }}>
              {name}
            </Text>{' '}
            <Link to={`character/${id.toString()}`}>
              <Button>Select</Button>{' '}
            </Link>
          </Group>
          {counters.map(({ id, name, current_value, initial_value }) => (
            <Badge key={id}>
              {name} {current_value}/{initial_value}
            </Badge>
          ))}
        </Card>
      ))}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Type character name"
          placeholder="New character name"
          {...form.getInputProps('name')}
        />
        <Group position="center" mt="xl">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader /> : 'Create a character'}
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default Dashboard;
