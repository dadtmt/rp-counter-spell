import { Loader } from '@mantine/core';
import dndclient from '../graphql/dnd/client';
import { useSpellByIndexQuery } from '../utils/__generated__/dndGraphql';

interface SpellProps {
  index: string;
}

const DisplaySpell = ({ index }: SpellProps) => {
  const { data, loading } = useSpellByIndexQuery({
    client: dndclient,
    variables: { index },
  });
  const spell = data?.spell;
  if (loading) {
    return <Loader />;
  }
  if (!spell) return <div>404</div>;
  const { name } = spell;
  return <li>{name}</li>;
};

export default DisplaySpell;
