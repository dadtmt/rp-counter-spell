import { ActionIcon, Badge, Card, Group, Table, Text } from '@mantine/core';
import { useState } from 'react';
import { Book, Book2, Eyeglass, EyeglassOff } from 'tabler-icons-react';
import { SpellStateAndData } from '../reducer/filterReducer';
import { useUpdateWrittenSpellMutation } from '../utils/__generated__/graphql';

interface SpellProps {
  spell: SpellStateAndData;
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
    },
  },
}: SpellProps) => {
  const [seeDesc, setSeeDesc] = useState(false);
  const [mutateUpdateWrittenSpell] = useUpdateWrittenSpellMutation({
    variables: { id, castable: !castable },
  });
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Group position="apart" mb="md">
        <ActionIcon onClick={() => setSeeDesc(!seeDesc)}>
          {seeDesc ? <EyeglassOff /> : <Eyeglass />}
        </ActionIcon>
        <ActionIcon onClick={() => mutateUpdateWrittenSpell()}>
          {castable ? <Book /> : <Book2 />}
        </ActionIcon>
        <Text size="xl" style={{ flexGrow: 1 }}>
          {name}
        </Text>
      </Group>
      <Badge m={5}>level: {level}</Badge>
      {concentration && <Badge m={5}>Concentration</Badge>}
      {ritual && <Badge m={5}>Ritual</Badge>}
      <Badge m={5}>School: {school.name}</Badge>
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
      {damage && (
        <Table m={5}>
          <thead>
            <tr>
              <th>Character level</th>
              {damage.damage_at_character_level?.map(
                ({ damage, level: characterLevel }) => (
                  <th>lvl {characterLevel}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Damage: {damage.damage_type?.name || ''}</td>
              {damage.damage_at_character_level?.map(({ damage }) => (
                <td>{damage}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      )}
      {heal_at_slot_level && (
        <Table m={5}>
          <thead>
            <tr>
              <th>Slot level</th>
              {heal_at_slot_level?.map(({ level: slotLevel }) => (
                <th>{slotLevel}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Heal</td>
              {heal_at_slot_level?.map(({ healing }) => (
                <td>{healing}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      )}
      {dc && <Badge m={5}>DC: {dc?.type?.name}</Badge>}
      {seeDesc &&
        desc.map((text, index) => (
          <Text key={index} color="dimmed">
            {text}
          </Text>
        ))}
    </Card>
  );
};

export default DisplaySpell;
