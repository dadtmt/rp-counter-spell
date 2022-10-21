import { useEffect, useState } from 'react';
import { Container, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import CopySpell from '../components/CopySpell';
import { useGetSpellsLazyQuery } from '../utils/__generated__/dndGraphql';
import dndclient from '../graphql/dnd/client';
import { useTitle } from '../components/Layout';
import CenteredLoader from '../components/CenteredLoader';

const Spells = () => {
  useTitle('Browse spells');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [getSpells, { data, loading }] = useGetSpellsLazyQuery({
    client: dndclient,
  });
  useEffect(() => {
    getSpells({ variables: { name: debouncedSearch } });
  }, [debouncedSearch, getSpells]);
  const spells = data?.spells;

  return (
    <Container>
      <TextInput
        label="Search"
        placeholder="spell name"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="lg"
      />
      {loading ? (
        <CenteredLoader />
      ) : (
        spells?.map((spell) => <CopySpell key={spell.index} spell={spell} />)
      )}
    </Container>
  );
};

export default Spells;
