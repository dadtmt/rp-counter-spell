import { useOutletContext } from 'react-router-dom';
import { CharacterContext } from './Character';
import DisplaySpell from '../components/DisplaySpell';

const Spellbook = () => {
  const {
    character: { writtenspells },
  } = useOutletContext<CharacterContext>();

  return (
    <div>
      Spellbook
      <ul>
        {writtenspells.map(({ dndindex }) => (
          <DisplaySpell index={dndindex} />
        ))}
      </ul>
    </div>
  );
};

export default Spellbook;
