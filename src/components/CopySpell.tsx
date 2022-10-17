import { Button, Card, Group, Text } from '@mantine/core';
import { useOutletContext } from 'react-router-dom';
import { CharacterContext } from './Character';
import { Spell } from '../utils/__generated__/dndGraphql';
import { useWriteSpellMutation } from '../utils/__generated__/graphql';

interface CopySpellProps {
  spell: Partial<Spell>;
}

const CopySpell = ({ spell: { index, name } }: CopySpellProps) => {
  const {
    character: { id: characterId, writtenspells },
  } = useOutletContext<CharacterContext>();
  const [mutateWriteSpell, { loading }] = useWriteSpellMutation({
    variables: { characterId, index: index || '' },
    refetchQueries: ['getCharacter'],
  });
  const alreadyWritten = writtenspells.find(
    ({ dndindex }) => dndindex === index
  )
    ? true
    : false;
  return (
    <Card key={index} shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Group position="apart">
        <Text size="xl" style={{ flexGrow: 1 }}>
          {name}
        </Text>
        <Button
          disabled={loading || alreadyWritten}
          onClick={() => mutateWriteSpell()}
        >
          Write Spell
        </Button>
      </Group>
    </Card>
  );
};

export default CopySpell;
