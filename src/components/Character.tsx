import { Alert, Loader } from '@mantine/core';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { LayoutContextType } from './Layout';
import {
  Characters,
  useGetCharacterQuery,
} from '../utils/__generated__/graphql';

export type CharacterContext = LayoutContextType & {
  character: Characters;
};

const Character = () => {
  const layoutContext = useOutletContext<LayoutContextType>();
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
  return (
    <div>
      <Outlet context={{ character, ...layoutContext }} />
    </div>
  );
};

export default Character;
