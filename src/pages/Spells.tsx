import { ApolloClient, InMemoryCache } from '@apollo/client';
import CopySpell from '../components/CopySpell';
import { useGetSpellsQuery } from '../utils/__generated__/dndGraphql';

const client = new ApolloClient({
  uri: 'https://www.dnd5eapi.co/graphql',
  cache: new InMemoryCache(),
});

const Spells = () => {
  const { data } = useGetSpellsQuery({ client });
  const spells = data?.spells;
  return (
    <div>
      Spells
      <ul>
        {spells?.map((spell) => (
          <CopySpell key={spell.index} spell={spell} />
        ))}
      </ul>
    </div>
  );
};

export default Spells;
