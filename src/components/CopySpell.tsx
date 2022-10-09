import { Button } from '@mantine/core';
import { useOutletContext } from 'react-router-dom';
import { CharacterContext } from '../pages/Character';
import { Spell } from '../utils/__generated__/dndGraphql';
import { useWriteSpellMutation } from '../utils/__generated__/graphql';

interface CopySpellProps {
  spell: Partial<Spell>;
}

const CopySpell = ({ spell: { index, name } }: CopySpellProps) => {
  const {
    character: { id: characterId },
  } = useOutletContext<CharacterContext>();
  const [mutateWriteSpell] = useWriteSpellMutation({
    variables: { characterId, index: index || '' },
  });
  return (
    <li>
      {name}
      <Button onClick={() => mutateWriteSpell()}>Write Spell</Button>
    </li>
  );
};

export default CopySpell;
