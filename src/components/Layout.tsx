import { Outlet, Link } from 'react-router-dom';
import { useSignOut, useUserId } from '@nhost/react';
import { Button, Container, Loader } from '@mantine/core';
import { useGetUserQuery, Users } from '../utils/__generated__/graphql';

export type LayoutContextType = {
  user: Users;
};

const Layout = () => {
  const { signOut } = useSignOut();

  const userId = useUserId();

  const { data, loading } = useGetUserQuery({ variables: { id: userId } });

  const user = data?.user;

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/',
    },
    {
      label: 'Profile',
      href: '/profile',
    },
    {
      label: 'Spells',
      href: '/spells',
    },
  ];

  if (loading) return <Loader />;

  return (
    <Container>
      {menuItems.map(({ label, href }) => (
        <Link key={label} to={href}>
          {label}
        </Link>
      ))}
      <Button onClick={signOut}>SignOut</Button>
      <Outlet context={{ user }} />
    </Container>
  );
};

export default Layout;
