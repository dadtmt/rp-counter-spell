import { Button, Group, Loader, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  Counters,
  useUpdateCounterMutation,
} from '../utils/__generated__/graphql';

interface UpdateCounterProps {
  counter: Partial<Counters>;
}

const UpdateCounter = ({
  counter: { id, name, initial_value },
}: UpdateCounterProps) => {
  const [mutateCreateCounter, { loading }] = useUpdateCounterMutation();
  const form = useForm({
    initialValues: { name, initialValue: initial_value },
  });
  const handleSubmit = async ({ name, initialValue }: typeof form.values) => {
    try {
      await mutateCreateCounter({
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
      </Group>
    </form>
  );
};

export default UpdateCounter;
