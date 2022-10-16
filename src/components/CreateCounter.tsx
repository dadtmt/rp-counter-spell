import {
  Button,
  Group,
  Input,
  Loader,
  NumberInput,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useCreateCounterMutation } from '../utils/__generated__/graphql';

const CreateCounter = ({ characterId }: { characterId: number }) => {
  const [mutateCreateCounter, { loading }] = useCreateCounterMutation({
    refetchQueries: ['getCharacter'],
  });
  const form = useForm({ initialValues: { name: '', initialValue: 1 } });
  const handleSubmit = async ({ name, initialValue }: typeof form.values) => {
    try {
      await mutateCreateCounter({
        variables: {
          name,
          initialValue,
          characterId,
        },
      });
      showNotification({ message: 'Counter creation successful' });
    } catch (error) {
      showNotification({ message: 'Counter creation error' });
    }
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group position="center">
        <TextInput
          label="New counter name"
          placeholder="name"
          {...form.getInputProps('name')}
        />
        <NumberInput
          label="Maximum value"
          {...form.getInputProps('initialValue')}
        />
      </Group>
      <Group position="center" mt="lg">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Create a counter'}
        </Button>
      </Group>
    </form>
  );
};

export default CreateCounter;
