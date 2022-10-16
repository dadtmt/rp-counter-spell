import { Container } from '@mantine/core';
import { useOutletContext } from 'react-router-dom';
import Counter from '../components/Counter';
import CreateCounter from '../components/CreateCounter';
import { CharacterContext } from './Character';

const Counters = () => {
  const {
    character: { id: characterId, counters },
  } = useOutletContext<CharacterContext>();
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
