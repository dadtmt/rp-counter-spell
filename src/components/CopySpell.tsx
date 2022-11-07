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
import { Eyeglass, EyeglassOff, Feather } from 'tabler-icons-react';
import CenteredLoader from './CenteredLoader';
import DisplaySpellDetail from './DisplaySpellDetail';
import { SpellData } from '../reducer/filterReducer';

interface CopySpellProps {
  spell: Pick<Spell, 'index' | 'name' | 'level'>;
}

const CopySpell = ({ spell: { index, name, level } }: CopySpellProps) => {
  const [seeDesc, setSeeDesc] = useState(false);
  const {
    character: { id: characterId, writtenspells },
  } = useOutletContext<CharacterContext>();
  const [getSpellData, { loading: spellDataLoading, data }] =
    useSpellByIndexLazyQuery({ variables: { index }, client });
  const [mutateWriteSpell, { loading }] = useWriteSpellMutation();
  const [localLoading, setLocalLoading] = useState(false);
  return (
    <Card key={index} shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Group position="apart" align="end">
        <ActionIcon
          onClick={() => {
            setSeeDesc(!seeDesc);
            getSpellData();
          }}
        >
          {seeDesc ? <EyeglassOff /> : <Eyeglass />}
        </ActionIcon>
        <Text size="md" style={{ flexGrow: 1 }}>
          (lvl {level}) {name}
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
      {seeDesc && spellDataLoading && <CenteredLoader />}
      {seeDesc && data?.spell && (
        <DisplaySpellDetail showDesc spellData={data.spell as SpellData} />
      )}
    </Card>
  );
};

export default CopySpell;
