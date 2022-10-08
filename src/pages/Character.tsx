import { Alert, Loader, Title } from '@mantine/core';
import { useParams } from 'react-router-dom';
import CreateCounter from '../components/CreateCounter';
import { useGetCharacterQuery } from '../utils/__generated__/graphql';

const Character = () => {
  const { characterId } = useParams();
  const { data, loading } = useGetCharacterQuery({
    variables: { id: parseInt(characterId || '') },
  });
  const character = data?.characters_by_pk;
  if (loading) {
    return <Loader />;
  }

  if (!character) {
    return <Alert>404 - character not found</Alert>;
  }
  const { id, name, counters } = character;

  return (
    <div>
      <Title>{name}</Title>
      <ul>
        {counters.map(
          ({ id, name: counterName, initial_value, current_value }) => (
            <li key={id}>
              {counterName}: {current_value || initial_value}/{initial_value}
            </li>
          )
        )}
      </ul>
      <CreateCounter characterId={id} />
    </div>
  );
};

export default Character;
