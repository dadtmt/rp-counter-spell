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
    <div>
      Spellbook
      <ul>
        {writtenspells.map(({ dndindex }) => (
          <DisplaySpell key={dndindex} index={dndindex} />
        ))}
      </ul>
    </div>
  );
};

export default Spellbook;
