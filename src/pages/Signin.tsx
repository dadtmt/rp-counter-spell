import { Link, Navigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSignInEmailPassword } from '@nhost/react';

const SignIn = () => {
  const form = useForm({
    initialValues: { email: '', password: '' },
  });

  const {
    signInEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error,
  } = useSignInEmailPassword();

  const handleSubmit = ({ email, password }: typeof form.values) => {
    signInEmailPassword(email, password);
  };

  if (isSuccess) {
    return <Navigate to="/" replace={true} />;
  }

  const disableForm = isLoading || needsEmailVerification;

  return (
    <Center>
      <Container size="xs" p="lg">
        {needsEmailVerification ? (
          <Alert>
            Please check your mailbox and follow the verification link to verify
            your email.
          </Alert>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              placeholder="Email"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Password"
              {...form.getInputProps('password')}
            />
            <Group position="center" mt="xl">
              <Button type="submit" disabled={disableForm}>
                {isLoading ? <Loader /> : 'Sign In'}
              </Button>
            </Group>
            {isError ? <Alert>{error?.message}</Alert> : null}
          </form>
        )}

        <p>
          No account yet? <Link to="/sign-up">Sign up</Link>
        </p>
      </Container>
    </Center>
  );
};

export default SignIn;
