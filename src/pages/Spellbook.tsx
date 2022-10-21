import { Container } from '@mantine/core';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CharacterContext } from '../components/Character';
import DisplaySpell from '../components/DisplaySpell';
import { useTitle } from '../components/Layout';
import SpellbookFilter from '../components/SpellbookFilter';

const Spellbook = () => {
  const {
    character: { name, writtenspells },
    filterState,
    filterDispatch,
  } = useOutletContext<CharacterContext>();
  useTitle(`${name} Spellbook`);

  useEffect(() => {
    filterDispatch({ type: 'SET_SPELLS', writtenspells });
  }, [filterDispatch, writtenspells]);

  return (
    <>
      <SpellbookFilter />
      <Container>
        {filterState.filteredSpells.map((spell) => {
          return <DisplaySpell key={spell.spellState.id} spell={spell} />;
        })}
      </Container>
    </>
  );
};

export default Spellbook;
