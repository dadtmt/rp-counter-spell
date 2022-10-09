import { Alert, Loader, Title } from '@mantine/core';
import { Outlet, useParams } from 'react-router-dom';
import {
  Characters,
  useGetCharacterQuery,
} from '../utils/__generated__/graphql';

export type CharacterContext = {
  character: Characters;
};

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

  return (
    <div>
      <Title>{name}</Title>
      <Outlet context={{ character }} />
    </div>
  );
};

export default Character;
