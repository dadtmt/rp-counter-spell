import { Button, Card, Group, Text } from '@mantine/core';
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
  const [localLoading, setLocalLoading] = useState(false);
  return (
    <Card key={index} shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Group position="apart" align="end">
        <Text size="md" style={{ flexGrow: 1 }}>
          {name}
        </Text>
        <Button
          size="sm"
          disabled={
            loading || writtenspells.find(({ dndindex }) => dndindex === index)
              ? true
              : false || spellDataLoading || localLoading
          }
          onClick={async () => {
            setLocalLoading(true);
            const { data } = await getSpellData();
            const spellData = data?.spell;
            const spellDataJson = JSON.stringify(spellData);
            await mutateWriteSpell({
              variables: {
                characterId,
                index: index || '',
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
          Write Spell
        </Button>
      </Group>
    </Card>
  );
};

export default CopySpell;
