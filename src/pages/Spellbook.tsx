import { Container } from '@mantine/core';
import { useOutletContext } from 'react-router-dom';
import { CharacterContext } from '../components/Character';
import DisplaySpell from '../components/DisplaySpell';
import { useTitle } from '../components/Layout';

const Spellbook = () => {
  const {
    character: { name },
    filterState,
  } = useOutletContext<CharacterContext>();
  useTitle(`${name} Spellbook`);

  return (
    <Container>
      {filterState.filteredSpells.map((spell) => {
        return <DisplaySpell key={spell.spellState.id} spell={spell} />;
      })}
    </Container>
  );
};

export default Spellbook;
