import { useOutletContext } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Button, Container, Group, Loader, TextInput } from '@mantine/core';
import { useUpdateUserMutation } from '../utils/__generated__/graphql';
import { LayoutContextType } from '../components/Layout';

const Profile = () => {
  const { user } = useOutletContext<LayoutContextType>();
  const form = useForm({
    initialValues: { displayName: user?.displayName || '' },
  });
  const [mutateUser, { loading: isLoading }] = useUpdateUserMutation();

  const handleSubmit = async ({ displayName }: typeof form.values) => {
    try {
      await mutateUser({
        variables: {
          id: user?.id,
          displayName,
        },
      });
      showNotification({ message: 'Profile update successful' });
    } catch (error) {
      showNotification({ message: 'Profile update error' });
    }
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Update your pseudo"
          {...form.getInputProps('displayName')}
        />
        <Group position="center" mt="xl">
          <Button type="submit">
            {isLoading ? <Loader /> : 'Update profile'}
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default Profile;
