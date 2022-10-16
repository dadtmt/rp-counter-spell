import { Alert, Loader } from '@mantine/core';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { LayoutContextType } from './Layout';
import {
  Characters,
  useGetCharacterQuery,
} from '../utils/__generated__/graphql';
import { useEffect } from 'react';

export type CharacterContext = LayoutContextType & {
  character: Characters;
};

const Character = () => {
  const layoutContext = useOutletContext<LayoutContextType>();
  const { setCharacterMenuItems } = layoutContext;
  const { characterId } = useParams();
  const { data, loading } = useGetCharacterQuery({
    variables: { id: parseInt(characterId || '') },
  });
  const character = data?.characters_by_pk;
  useEffect(() => {
    if (character) {
      const prefix = `/character/${characterId}`;
      setCharacterMenuItems([
        { label: 'Counters', href: prefix },
        { label: 'Spellbook', href: `${prefix}/spellbook` },
        { label: 'Browse spells', href: `${prefix}/spells` },
      ]);
    }
  }, [character, characterId, setCharacterMenuItems]);
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
