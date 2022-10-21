import { Outlet, Link, useLocation, useOutletContext } from 'react-router-dom';
import { useSignOut, useUserId } from '@nhost/react';
import {
  AppShell,
  Badge,
  Burger,
  Button,
  Footer,
  Group,
  Header,
  MediaQuery,
  Navbar,
  NavLink,
  Title,
} from '@mantine/core';
import { useGetUserQuery, Users } from '../utils/__generated__/graphql';
import React, { useEffect, useReducer, useState } from 'react';
import filterReducer, {
  FilterAction,
  FilterState,
} from '../reducer/filterReducer';
import { Book, Book2 } from 'tabler-icons-react';
import CenteredLoader from './CenteredLoader';

type MenuItem = {
  label: string;
  href: string;
};

export type LayoutContextType = {
  user: Users;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setCharacterMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  filterOpened: boolean;
  setFilterOpened: React.Dispatch<React.SetStateAction<boolean>>;
  filterState: FilterState;
  filterDispatch: React.Dispatch<FilterAction>;
};

export const useTitle = (title: string) => {
  const { setTitle } = useOutletContext<LayoutContextType>();
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
};

const Layout = () => {
  const [title, setTitle] = useState('');
  const [characterMenuItems, setCharacterMenuItems] = useState<MenuItem[]>([]);
  const [opened, setOpened] = useState(false);
  const [filterOpened, setFilterOpened] = useState(false);
  const { signOut } = useSignOut();
  const location = useLocation();
  const userId = useUserId();
  const [filterState, filterDispatch] = useReducer(filterReducer, {
    castableSelected: true,
    nonCastableSelected: true,
    allLevelsSelected: true,
    spellLevels: [],
    spells: [],
    filteredSpells: [],
  });

  const { data, loading } = useGetUserQuery({ variables: { id: userId } });
  const user = data?.user;
  const { castableSelected, nonCastableSelected, spellLevels } = filterState;

  const menuItems = [
    {
      label: 'Character selection',
      href: '/',
    },
    {
      label: 'Profile',
      href: '/profile',
    },
  ];

  if (loading) return <CenteredLoader />;

  return (
    <AppShell
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          {characterMenuItems.map(({ label, href }) => (
            <NavLink
              key={href}
              label={label}
              component={Link}
              to={href}
              active={location.pathname === href}
              onClick={() => setOpened(false)}
            />
          ))}
          {menuItems.map(({ label, href }) => (
            <NavLink
              key={href}
              label={label}
              component={Link}
              to={href}
              active={location.pathname === href}
              onClick={() => setOpened(false)}
              defaultOpened
            ></NavLink>
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
      footer={
        <Footer
          height={70}
          p="md"
          hidden={!location.pathname.includes('spellbook')}
        >
          <Group position="center">
            {castableSelected && <Book />}
            {nonCastableSelected && <Book2 />}
            <Badge>
              lvl.{' '}
              {spellLevels
                .filter(({ selected }) => selected)
                .map(({ level }) => level)
                .join('/')}
            </Badge>
            <Button onClick={() => setFilterOpened(true)}>Filter</Button>
          </Group>
        </Footer>
      }
    >
      <Outlet
        context={{
          user,
          title,
          setCharacterMenuItems,
          setTitle,
          filterOpened,
          setFilterOpened,
          filterState,
          filterDispatch,
        }}
      />
    </AppShell>
  );
};

export default Layout;
