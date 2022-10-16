import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSignOut, useUserId } from '@nhost/react';
import {
  AppShell,
  Burger,
  Button,
  Group,
  Header,
  Loader,
  MediaQuery,
  Navbar,
  NavLink,
} from '@mantine/core';
import { useGetUserQuery, Users } from '../utils/__generated__/graphql';
import { useState } from 'react';

export type LayoutContextType = {
  user: Users;
};

const Layout = () => {
  const [opened, setOpened] = useState(false);
  const { signOut } = useSignOut();
  const location = useLocation();

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
  ];

  if (loading) return <Loader />;

  return (
    <AppShell
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          {menuItems.map(({ label, href }) => (
            <NavLink
              key={href}
              label={label}
              component={Link}
              to={href}
              active={location.pathname === href}
              onClick={() => setOpened(false)}
            />
          ))}
          <Group position="center" mt="xl">
            <Button onClick={signOut}>SignOut</Button>
          </Group>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Group position="right">
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </Group>
          </MediaQuery>
        </Header>
      }
    >
      <Outlet context={{ user }} />
    </AppShell>
  );
};

export default Layout;
