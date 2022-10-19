import { Container } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CharacterContext } from '../components/Character';
import DisplaySpell from '../components/DisplaySpell';
import { useTitle } from '../components/Layout';
import { Spell } from '../utils/__generated__/dndGraphql';
import { Writtenspells } from '../utils/__generated__/graphql';

export type SpellStateAndData = { spellState: Writtenspells; spellData: Spell };

const Spellbook = () => {
  const {
    character: { writtenspells, name },
  } = useOutletContext<CharacterContext>();
  useTitle(`${name} Spellbook`);
  const [spells, setSpells] = useState<SpellStateAndData[]>([]);
  useEffect(() => {
    setSpells(
      writtenspells.map((spellState) => {
        const spellData: Spell = JSON.parse(spellState.spell_data);
        return { spellState, spellData };
      })
    );
  }, [writtenspells]);
  return (
    <Container>
      {spells.map((spell) => {
        return <DisplaySpell key={spell.spellState.id} spell={spell} />;
      })}
    </Container>
  );
};

export default Spellbook;
