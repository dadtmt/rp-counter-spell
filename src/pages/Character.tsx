import { Alert, Loader } from '@mantine/core';
import { useParams } from 'react-router-dom';
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
  const { name } = character;
  return loading ? <Loader /> : <div>{name}</div>;
};

export default Character;
