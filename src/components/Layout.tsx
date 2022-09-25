import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useUserData, useSignOut } from '@nhost/react';
import { Button, Container } from '@mantine/core';

export type LayoutContextType = {
  user: ReturnType<typeof useUserData>;
};

const Layout = () => {
  const { signOut } = useSignOut();

  const user = useUserData();

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/',
    },
    {
      label: 'Profile',
      href: '/profile',
    },
  ];

  return (
    <Container>
      {menuItems.map(({ label, href }) => (
        <Link to={href}>{label}</Link>
      ))}
      <Button onClick={signOut}>SignOut</Button>
      <Outlet context={{ user }} />
    </Container>
  );
};

export default Layout;
