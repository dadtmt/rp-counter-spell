import { Container } from '@mantine/core';
import { useOutletContext } from 'react-router-dom';
import { CharacterContext } from '../components/Character';
import DisplaySpell from '../components/DisplaySpell';
import { useTitle } from '../components/Layout';

const Spellbook = () => {
  const {
    character: { writtenspells, name },
  } = useOutletContext<CharacterContext>();
  useTitle(`${name} Spellbook`);
  return (
    <Container>
      {writtenspells.map(({ dndindex }) => (
        <DisplaySpell key={dndindex} index={dndindex} />
      ))}
    </Container>
  );
};

export default Spellbook;
