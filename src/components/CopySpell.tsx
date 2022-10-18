import { Button, Card, Group, Text } from '@mantine/core';
import { useOutletContext } from 'react-router-dom';
import { CharacterContext } from './Character';
import {
  Spell,
  useSpellByIndexLazyQuery,
} from '../utils/__generated__/dndGraphql';
import { useWriteSpellMutation } from '../utils/__generated__/graphql';
import client from '../graphql/dnd/client';

interface CopySpellProps {
  spell: Partial<Spell>;
}

const CopySpell = ({ spell: { index, name } }: CopySpellProps) => {
  const {
    character: { id: characterId, writtenspells },
  } = useOutletContext<CharacterContext>();
  const [getSpellData, { loading: spellDataLoading }] =
    useSpellByIndexLazyQuery({ variables: { index: index || '' }, client });
  const [mutateWriteSpell, { loading }] = useWriteSpellMutation();
  const alreadyWritten = writtenspells.find(
    ({ dndindex }) => dndindex === index
  )
    ? true
    : false;
  return (
    <Card key={index} shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Group position="apart" align="end">
        <Text size="md" style={{ flexGrow: 1 }}>
          {name}
        </Text>
        <Button
          size="sm"
          disabled={loading || alreadyWritten || spellDataLoading}
          onClick={async () => {
            const { data } = await getSpellData();
            const spellData = data?.spell;
            mutateWriteSpell({
              variables: {
                characterId,
                index: index || '',
                spellData: JSON.stringify(spellData),
              },
              refetchQueries: ['getCharacter'],
            });
          }}
        >
          Write Spell
        </Button>
      </Group>
    </Card>
  );
};

export default CopySpell;
