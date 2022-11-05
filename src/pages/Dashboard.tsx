import { Link, useOutletContext } from 'react-router-dom';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Loader,
  Modal,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import { LayoutContextType, useTitle } from '../components/Layout';
import { useForm } from '@mantine/form';
import {
  Characters,
  useCreateCharacterMutation,
  useDeleteCharacterMutation,
} from '../utils/__generated__/graphql';
import { showNotification } from '@mantine/notifications';
import { Accessible, AlertCircle, Eraser } from 'tabler-icons-react';
import { useState } from 'react';

type CharacterIdName = Pick<Characters, 'id' | 'name'>;

const Dashboard = () => {
  const { user } = useOutletContext<LayoutContextType>();
  useTitle(`${user?.displayName} Characters`);
  const form = useForm({
    initialValues: { name: '' },
  });
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CharacterIdName>({
    id: 0,
    name: '',
  });

  const [mutateCreateCharacter, { loading }] = useCreateCharacterMutation({
    refetchQueries: ['GetUser'],
  });
  const [mutateDelCharacter] = useDeleteCharacterMutation({
    refetchQueries: ['GetUser'],
    variables: { id: deleteTarget.id },
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

  const handleDelete = (ch: CharacterIdName) => {
    setDeleteTarget(ch);
    setDeleteOpened(true);
  };

  return (
    <>
      <Modal opened={deleteOpened} onClose={() => setDeleteOpened(false)}>
        <Alert color="red" icon={<AlertCircle />} title="Confirm or cancel">
          If you confirm deletion, {deleteTarget.name} data will be deleted
          forever!
        </Alert>
        <Group position="center" mt="xl">
          <Button
            color="red"
            disabled={deleteTarget.id === 0}
            onClick={async () => {
              await mutateDelCharacter();
              setDeleteOpened(false);
            }}
          >
            Confirm delete
          </Button>
          <Button onClick={() => setDeleteOpened(false)}>Cancel delete</Button>
        </Group>
      </Modal>
      <Container>
        {user.characters.map(({ id, name, counters }) => (
          <Card key={id} shadow="sm" p="lg" radius="md" withBorder mt="xl">
            <Group position="apart" mb="md">
              <Text size="xl" style={{ flexGrow: 1 }}>
                {name}
              </Text>{' '}
              <Link to={`character/${id.toString()}`}>
                <ActionIcon>
                  <Accessible />
                </ActionIcon>
              </Link>
              <ActionIcon onClick={() => handleDelete({ id, name })}>
                <Eraser />
              </ActionIcon>
            </Group>
            {counters.map(({ id, name, current_value, initial_value }) => (
              <Badge key={id} mr="xs">
                {name}: {current_value} / {initial_value}
              </Badge>
            ))}
          </Card>
        ))}
        <Space h="lg" />
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
    </>
  );
};

export default Dashboard;
