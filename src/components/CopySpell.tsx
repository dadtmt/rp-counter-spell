import { ActionIcon, Card, Group, Text } from '@mantine/core';
import { useOutletContext } from 'react-router-dom';
import { CharacterContext } from './Character';
import {
  Spell,
  useSpellByIndexLazyQuery,
} from '../utils/__generated__/dndGraphql';
import {
  GetCharacterDocument,
  GetCharacterQuery,
  useWriteSpellMutation,
} from '../utils/__generated__/graphql';
import client from '../graphql/dnd/client';
import { useState } from 'react';
import { Feather } from 'tabler-icons-react';

interface CopySpellProps {
  spell: Pick<Spell, 'index' | 'name'>;
}

const CopySpell = ({ spell: { index, name } }: CopySpellProps) => {
  const {
    character: { id: characterId, writtenspells },
  } = useOutletContext<CharacterContext>();
  const [getSpellData, { loading: spellDataLoading }] =
    useSpellByIndexLazyQuery({ variables: { index }, client });
  const [mutateWriteSpell, { loading }] = useWriteSpellMutation();
  const [localLoading, setLocalLoading] = useState(false);
  return (
    <Card key={index} shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Group position="apart" align="end">
        <Text size="md" style={{ flexGrow: 1 }}>
          {name}
        </Text>
        <ActionIcon
          size="sm"
          disabled={
            loading ||
            writtenspells.some(({ dndindex }) => dndindex === index) ||
            spellDataLoading ||
            localLoading
          }
          onClick={async () => {
            setLocalLoading(true);
            const { data } = await getSpellData();
            const spellData = data?.spell;
            const spellDataJson = JSON.stringify(spellData);
            await mutateWriteSpell({
              variables: {
                characterId,
                index,
                spellData: spellDataJson,
              },
              update: (cache, { data: writeSpellData }) => {
                const result = writeSpellData?.insert_writtenspells_one;
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
                      writtenspells: [...writtenSpells, result],
                    },
                  },
                });
              },
            });
            setLocalLoading(false);
          }}
        >
          <Feather />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default CopySpell;
