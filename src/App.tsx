import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { NhostClient, NhostReactProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { InMemoryCache } from '@apollo/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Character from './components/Character';
import Counters from './pages/Counters';
import Dashboard from './pages/Dashboard';
import EditCounter from './pages/EditCounter';
import Profile from './pages/Profile';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import Spellbook from './pages/Spellbook';
import Spells from './pages/Spells';
import SpellDetail from './pages/SpellDetail';

const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
  region: process.env.REACT_APP_NHOST_REGION,
});

function App() {
  return (
    <MantineProvider
      theme={{ colorScheme: 'dark' }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider>
        <NhostReactProvider nhost={nhost}>
          <NhostApolloProvider
            nhost={nhost}
            cache={
              new InMemoryCache({
                typePolicies: {
                  characters: {
                    fields: {
                      counters: { merge: false },
                      writtenspells: { merge: false },
                    },
                  },
                },
              })
            }
          >
            <HashRouter>
              <Routes>
                <Route path="sign-up" element={<SignUp />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="character/:characterId" element={<Character />}>
                    <Route index element={<Counters />} />
                    <Route
                      path="counter/:counterId"
                      element={<EditCounter />}
                    />
                    <Route path="spells" element={<Spells />} />
                    <Route path="spellbook" element={<Spellbook />} />
                    <Route
                      path="spellDetail/:spellId"
                      element={<SpellDetail />}
                    />
                  </Route>
                </Route>
              </Routes>
            </HashRouter>
          </NhostApolloProvider>
        </NhostReactProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
