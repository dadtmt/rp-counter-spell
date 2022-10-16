import { Outlet, Link, useLocation, useOutletContext } from 'react-router-dom';
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
  Title,
} from '@mantine/core';
import { useGetUserQuery, Users } from '../utils/__generated__/graphql';
import React, { useEffect, useState } from 'react';

export type LayoutContextType = {
  user: Users;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const useTitle = (title: string) => {
  const { setTitle } = useOutletContext<LayoutContextType>();
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
};

const Layout = () => {
  const [title, setTitle] = useState('Welcome');
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
          <Group position="apart">
            <Title size="sm">{title}</Title>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </MediaQuery>
          </Group>
        </Header>
      }
    >
      <Outlet context={{ user, title, setTitle }} />
    </AppShell>
  );
};

export default Layout;
