import { Link, useOutletContext } from 'react-router-dom';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  List,
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
import { Accessible, AlertCircle, Book, Eraser, Eye } from 'tabler-icons-react';
import { useState } from 'react';
import { Spell } from '../utils/__generated__/dndGraphql';

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
        {user.characters.map(({ id, name, counters, writtenspells }) => (
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
            {[...counters]
              .sort(({ name: nameA }, { name: nameB }) =>
                nameA.localeCompare(nameB)
              )
              .map(({ id, name, current_value, initial_value }) => (
                <Badge key={id} mr="xs">
                  {name}: {current_value} / {initial_value}
                </Badge>
              ))}
            <Divider my="sm" />
            <List listStyleType="none">
              {Object.entries(
                writtenspells
                  .filter(({ castable }) => castable)
                  .map(({ id: spellId, spell_data }) => {
                    const spell: Spell = JSON.parse(spell_data);
                    return { spellId, spell };
                  })
                  .sort(
                    ({ spell: spellA }, { spell: spellB }) =>
                      spellA.level - spellB.level ||
                      spellA.name.localeCompare(spellB.name)
                  )
                  .reduce(
                    (
                      acc: Record<number, { spellId: number; spell: Spell }[]>,
                      { spellId, spell }
                    ) => {
                      const { level } = spell;
                      return Object.keys(acc).includes(level.toString())
                        ? {
                            ...acc,
                            [level]: [...acc[level], { spellId, spell }],
                          }
                        : {
                            ...acc,
                            [level]: [{ spellId, spell }],
                          };
                    },
                    {}
                  )
              ).map(([level, spells]) => {
                return (
                  <List.Item key={level}>
                    <Text italic>Level {level}</Text>
                    <List listStyleType="none">
                      {spells.map(({ spellId, spell: { name, level } }) => {
                        return (
                          <List.Item key={spellId}>
                            <Group position="apart">
                              <Text>{name}</Text>
                              <Link
                                to={`character/${id.toString()}/spellDetail/${spellId.toString()}`}
                              >
                                <ActionIcon>
                                  <Eye />
                                </ActionIcon>
                              </Link>
                            </Group>
                          </List.Item>
                        );
                      })}
                    </List>
                  </List.Item>
                );
              })}
            </List>
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
