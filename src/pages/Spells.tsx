import { ApolloClient, InMemoryCache } from '@apollo/client';
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
        {spells?.map(({ name, index }) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Spells;
