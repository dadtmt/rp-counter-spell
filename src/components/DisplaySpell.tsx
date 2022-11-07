import { ActionIcon, Badge, Card, Group, Text } from '@mantine/core';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Book, Book2, Eraser, Eyeglass, EyeglassOff } from 'tabler-icons-react';
import { SpellStateAndData } from '../reducer/filterReducer';
import {
  GetCharacterDocument,
  GetCharacterQuery,
  useEraseSpellMutation,
  useUpdateWrittenSpellMutation,
} from '../utils/__generated__/graphql';
import { CharacterContext } from './Character';
import DisplaySpellDetail from './DisplaySpellDetail';

interface SpellProps {
  spell: SpellStateAndData;
  showDesc?: boolean;
}

const DisplaySpell = ({
  spell: {
    spellState: { id, castable },
    spellData,
  },
  showDesc = false,
}: SpellProps) => {
  const [seeDesc, setSeeDesc] = useState(showDesc);
  const {
    character: { id: characterId },
  } = useOutletContext<CharacterContext>();
  const [mutateUpdateWrittenSpell] = useUpdateWrittenSpellMutation({
    variables: { id, castable: !castable },
  });
  const [mutateEraseSpell] = useEraseSpellMutation({
    variables: { id },
    update: (cache) => {
      const queryOptions = {
        query: GetCharacterDocument,
        variables: { id: characterId },
      };
      const data = cache.readQuery(queryOptions) as GetCharacterQuery;
      const characterData = data?.characters_by_pk;
      const writtenSpells = characterData?.writtenspells || [];
      cache.writeQuery({
        ...queryOptions,
        data: {
          ...data,
          characters_by_pk: {
            ...characterData,
            writtenspells: writtenSpells.filter(({ id: wsid }) => id !== wsid),
          },
        },
      });
    },
  });
  const { name, level } = spellData;
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Group position="apart" mb="md">
        <Group position="left">
          <ActionIcon onClick={() => setSeeDesc(!seeDesc)}>
            {seeDesc ? <EyeglassOff /> : <Eyeglass />}
          </ActionIcon>
          <ActionIcon onClick={() => mutateUpdateWrittenSpell()}>
            {castable ? <Book /> : <Book2 />}
          </ActionIcon>
        </Group>
        <Badge m={5}>level: {level}</Badge>
        <ActionIcon onClick={() => mutateEraseSpell()}>
          <Eraser />
        </ActionIcon>
      </Group>
      <Text size="xl" style={{ flexGrow: 1 }} mb="md">
        {name}
      </Text>
      <DisplaySpellDetail showDesc={seeDesc} spellData={spellData} />
    </Card>
  );
};

export default DisplaySpell;
