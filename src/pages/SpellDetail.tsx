import { Alert } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { CharacterContext } from '../components/Character';
import DisplaySpell from '../components/DisplaySpell';
import { SpellStateAndData } from '../reducer/filterReducer';

const SpellDetail = () => {
  const [spell, setSpell] = useState<SpellStateAndData | null>(null);
  const { spellId } = useParams();
  const {
    character: { writtenspells },
  } = useOutletContext<CharacterContext>();
  useEffect(() => {
    if (spellId) {
      const ws = writtenspells.find(({ id }) => id === parseInt(spellId));
      if (ws) {
        setSpell({ spellState: ws, spellData: JSON.parse(ws.spell_data) });
      }
    }
  }, [spellId, writtenspells]);
  if (!spell) return <Alert>404 - Cannot find this spell</Alert>;
  return <DisplaySpell spell={spell} showDesc />;
};

export default SpellDetail;
