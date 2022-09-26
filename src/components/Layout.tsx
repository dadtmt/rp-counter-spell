import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useUserData, useSignOut, useUserId } from '@nhost/react';
import { Button, Container, Loader } from '@mantine/core';
import { gql, useQuery } from '@apollo/client';

export type LayoutContextType = {
  user: ReturnType<typeof useUserData>;
};

const GET_USER_QUERY = gql`
  query GetUser($id: uuid!) {
    user(id: $id) {
      id
      displayName
    }
  }
`;

const Layout = () => {
  const { signOut } = useSignOut();

  const userId = useUserId();

  const { loading, data } = useQuery(GET_USER_QUERY, {
    variables: { id: userId },
    skip: !userId,
  });

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
