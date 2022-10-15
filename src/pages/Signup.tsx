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
import { useSignUpEmailPassword } from '@nhost/react';

const SignUp = () => {
  const form = useForm({
    initialValues: { displayName: '', email: '', password: '' },
  });

  const {
    signUpEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error,
  } = useSignUpEmailPassword();

  const handleSubmit = ({
    displayName,
    email,
    password,
  }: typeof form.values) => {
    signUpEmailPassword(email, password, {
      displayName,
    });
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
              label="Pseudo"
              placeholder="Pseudo"
              {...form.getInputProps('displayName')}
            />

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
                {isLoading ? <Loader /> : 'Create account'}
              </Button>
            </Group>

            {isError ? <Alert>{error?.message}</Alert> : null}
          </form>
        )}

        <p>
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </Container>
    </Center>
  );
};

export default SignUp;
