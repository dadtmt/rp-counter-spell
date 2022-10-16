import { Container } from '@mantine/core';
import { useOutletContext } from 'react-router-dom';
import Counter from '../components/Counter';
import CreateCounter from '../components/CreateCounter';
import { useTitle } from '../components/Layout';
import { CharacterContext } from '../components/Character';

const Counters = () => {
  const {
    character: { id: characterId, counters, name },
  } = useOutletContext<CharacterContext>();
  useTitle(`${name} counters`);
  return (
    <Container>
      {counters.map((counter) => (
        <Counter key={counter.id} {...counter} />
      ))}
      <CreateCounter characterId={characterId} />
    </Container>
  );
};

export default Counters;
