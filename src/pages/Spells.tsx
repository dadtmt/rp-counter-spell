import CopySpell from '../components/CopySpell';
import { useGetSpellsQuery } from '../utils/__generated__/dndGraphql';
import dndclient from '../graphql/dnd/client';

const Spells = () => {
  const { data } = useGetSpellsQuery({ client: dndclient });
  const spells = data?.spells;
  return (
    <div>
      Spells
      <ul>
        {spells?.map((spell) => (
          <CopySpell key={spell.index} spell={spell} />
        ))}
      </ul>
    </div>
  );
};

export default Spells;
