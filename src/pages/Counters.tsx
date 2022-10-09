import { useOutletContext } from 'react-router-dom';
import Counter from '../components/Counter';
import CreateCounter from '../components/CreateCounter';
import { CharacterContext } from './Character';

const Counters = () => {
  const {
    character: { id: characterId, counters },
  } = useOutletContext<CharacterContext>();
  return (
    <div>
      <ul>
        {counters.map((counter) => (
          <Counter key={counter.id} {...counter} />
        ))}
      </ul>
      <CreateCounter characterId={characterId} />
    </div>
  );
};

export default Counters;
