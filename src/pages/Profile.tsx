import { useOutletContext } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { LayoutContextType } from '../components/Layout';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Button, Container, Input, Loader } from '@mantine/core';

const UPDATE_USER_MUTATION = gql`
  mutation ($id: uuid!, $displayName: String!) {
    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName }) {
      id
      displayName
    }
  }
`;

const Profile = () => {
  const { user } = useOutletContext<LayoutContextType>();
  const form = useForm({
    initialValues: { displayName: user?.displayName },
  });
  const [mutateUser, { loading: isLoading }] =
    useMutation(UPDATE_USER_MUTATION);

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
        <Input placeholder="Pseudo" {...form.getInputProps('displayName')} />
        <Button type="submit">
          {isLoading ? <Loader /> : 'Update profile'}
        </Button>
      </form>
    </Container>
  );
};

export default Profile;
