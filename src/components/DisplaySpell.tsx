import {
  ActionIcon,
  Badge,
  Card,
  Group,
  ScrollArea,
  Table,
  Text,
} from '@mantine/core';
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

interface SpellProps {
  spell: SpellStateAndData;
  showDesc?: boolean;
}

const DisplaySpell = ({
  spell: {
    spellState: { id, castable },
    spellData: {
      name,
      desc,
      level,
      attack_type,
      school,
      area_of_effect,
      casting_time,
      components,
      duration,
      damage,
      range,
      heal_at_slot_level,
      concentration,
      ritual,
      dc,
      higher_level,
    },
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
      {concentration && <Badge m={5}>Concentration</Badge>}
      {ritual && <Badge m={5}>Ritual</Badge>}
      <Badge m={5}>{school.name}</Badge>
      <Badge m={5}>Casting time: {casting_time}</Badge>
      <Badge m={5}>Duration: {duration}</Badge>
      {components && <Badge m={5}>Components: {components.join(' / ')}</Badge>}
      {attack_type && <Badge m={5}>Attack type: {attack_type}</Badge>}
      {range && <Badge m={5}>Range: {range}</Badge>}
      {area_of_effect && (
        <Badge m={5}>
          Aera: {area_of_effect.size} {area_of_effect.type}
        </Badge>
      )}
      {dc && <Badge m={5}>DC: {dc?.type?.name}</Badge>}
      {damage && !damage?.damage_at_character_level && (
        <Badge m={5}>Damage: {damage.damage_type?.name}</Badge>
      )}
      {damage?.damage_at_character_level && (
        <ScrollArea>
          <Table m={5}>
            <thead>
              <tr>
                <th>Character level</th>
                {damage.damage_at_character_level?.map(
                  ({ level: characterLevel }) => (
                    <th key={characterLevel}>{characterLevel}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Damage: {damage.damage_type?.name || ''}</td>
                {damage.damage_at_character_level?.map(
                  ({ damage, level: characterLevel }) => (
                    <td key={characterLevel}>{damage}</td>
                  )
                )}
              </tr>
            </tbody>
          </Table>
        </ScrollArea>
      )}
      {damage?.damage_at_slot_level && (
        <ScrollArea>
          <Table m={5}>
            <thead>
              <tr>
                <th>Slot level</th>
                {damage.damage_at_slot_level?.map(({ level: slotLevel }) => (
                  <th key={slotLevel}>{slotLevel}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Damage: {damage.damage_type?.name || ''}</td>
                {damage.damage_at_slot_level?.map(
                  ({ damage, level: slotLevel }) => (
                    <td key={slotLevel}>{damage}</td>
                  )
                )}
              </tr>
            </tbody>
          </Table>
        </ScrollArea>
      )}
      {heal_at_slot_level && (
        <ScrollArea>
          <Table m={5}>
            <thead>
              <tr>
                <th>Slot level</th>
                {heal_at_slot_level?.map(({ level: slotLevel }) => (
                  <th key={slotLevel}>{slotLevel}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Heal</td>
                {heal_at_slot_level?.map(({ healing, level: slotLevel }) => (
                  <td key={slotLevel}>{healing}</td>
                ))}
              </tr>
            </tbody>
          </Table>
        </ScrollArea>
      )}
      {seeDesc &&
        desc.map((text, index) => (
          <Text key={index} color="dimmed">
            {text}
          </Text>
        ))}
      {seeDesc && higher_level && (
        <>
          <Text>At higher levels:</Text>
          {higher_level.map((text, index) => (
            <Text key={index} color="dimmed">
              {text}
            </Text>
          ))}
        </>
      )}
    </Card>
  );
};

export default DisplaySpell;
