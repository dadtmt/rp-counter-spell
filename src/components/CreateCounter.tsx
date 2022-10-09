import { Button, Input, Loader, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useCreateCounterMutation } from '../utils/__generated__/graphql';

const CreateCounter = ({ characterId }: { characterId: number }) => {
  const [mutateCreateCounter, { loading }] = useCreateCounterMutation({
    refetchQueries: ['getCharacter'],
  });
  const form = useForm({ initialValues: { name: '', initialValue: 0 } });
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
      <Input placeholder="New counter name" {...form.getInputProps('name')} />
      <NumberInput {...form.getInputProps('initialValue')} />
      <Button type="submit" disabled={loading}>
        {loading ? <Loader /> : 'Create a counter'}
      </Button>
    </form>
  );
};

export default CreateCounter;
