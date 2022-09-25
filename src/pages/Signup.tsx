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
    <Container>
      {needsEmailVerification ? (
        <Alert>
          Please check your mailbox and follow the verification link to verify
          your email.
        </Alert>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Input placeholder="Pseudo" {...form.getInputProps('displayName')} />

          <Input placeholder="Email" {...form.getInputProps('email')} />
          <PasswordInput
            placeholder="Password"
            {...form.getInputProps('password')}
          />

          <Button type="submit" disabled={disableForm}>
            {isLoading ? <Loader /> : 'Create account'}
          </Button>

          {isError ? <Alert>{error?.message}</Alert> : null}
        </form>
      )}

      <p>
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </p>
    </Container>
  );
};

export default SignUp;
