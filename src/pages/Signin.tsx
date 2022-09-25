import { Link, Navigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Container,
  Input,
  Loader,
  PasswordInput,
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
    <Container>
      {needsEmailVerification ? (
        <Alert>
          Please check your mailbox and follow the verification link to verify
          your email.
        </Alert>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Input placeholder="Email" {...form.getInputProps('email')} />
          <PasswordInput
            placeholder="Password"
            {...form.getInputProps('password')}
          />

          <Button type="submit" disabled={disableForm}>
            {isLoading ? <Loader /> : 'Sign In'}
          </Button>

          {isError ? <Alert>{error?.message}</Alert> : null}
        </form>
      )}

      <p>
        No account yet? <Link to="/sign-up">Sign up</Link>
      </p>
    </Container>
  );
};

export default SignIn;
