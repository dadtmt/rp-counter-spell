import { Button, Group, Loader, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Counters,
  GetCharacterDocument,
  GetCharacterQuery,
  useDeleteCounterMutation,
  useUpdateCounterMutation,
} from '../utils/__generated__/graphql';
import { CharacterContext } from './Character';

interface UpdateCounterProps {
  counter: Partial<Counters>;
}

const UpdateCounter = ({
  counter: { id, name, initial_value },
}: UpdateCounterProps) => {
  const {
    character: { id: characterId },
  } = useOutletContext<CharacterContext>();
  const navigate = useNavigate();
  const [mutateUpdateCounter, { loading }] = useUpdateCounterMutation();
  const [mutateDelCounter] = useDeleteCounterMutation({
    variables: { id: id || 0 },
    update: (cache) => {
      const queryOptions = {
        query: GetCharacterDocument,
        variables: { id: characterId },
      };
      const data = cache.readQuery(queryOptions) as GetCharacterQuery;
      const characterData = data?.characters_by_pk;
      const counters = characterData?.counters || [];
      cache.writeQuery({
        ...queryOptions,
        data: {
          ...data,
          characters_by_pk: {
            ...characterData,
            counters: counters.filter(({ id: cid }) => id !== cid),
          },
        },
      });
    },
  });
  const form = useForm({
    initialValues: { name, initialValue: initial_value },
  });
  const handleSubmit = async ({ name, initialValue }: typeof form.values) => {
    try {
      await mutateUpdateCounter({
        variables: {
          id: id!,
          name,
          initialValue,
        },
      });
      showNotification({ message: 'Counter update successful' });
    } catch (error) {
      showNotification({ message: 'Counter update error' });
    }
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group position="center" mt="xl">
        <TextInput
          label="Update counter name"
          placeholder="name"
          {...form.getInputProps('name')}
        />
        <NumberInput
          label="Update maximum value"
          {...form.getInputProps('initialValue')}
        />
      </Group>
      <Group position="center" mt="lg">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Update'}
        </Button>
        <Button
          color="red"
          disabled={loading}
          onClick={async () => {
            await mutateDelCounter();
            navigate(`/character/${characterId.toString()}`);
          }}
        >
          Delete
        </Button>
      </Group>
    </form>
  );
};

export default UpdateCounter;
