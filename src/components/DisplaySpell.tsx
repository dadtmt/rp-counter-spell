import { ActionIcon, Badge, Card, Group, Loader, Text } from '@mantine/core';
import { useState } from 'react';
import { Eyeglass, EyeglassOff } from 'tabler-icons-react';
import dndclient from '../graphql/dnd/client';
import { useSpellByIndexQuery } from '../utils/__generated__/dndGraphql';

interface SpellProps {
  index: string;
}

const DisplaySpell = ({ index }: SpellProps) => {
  const [seeDesc, setSeeDesc] = useState(false);
  const { data, loading } = useSpellByIndexQuery({
    client: dndclient,
    variables: { index },
  });
  const spell = data?.spell;
  if (loading) {
    return <Loader />;
  }
  if (!spell) return <div>404</div>;
  const {
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
  } = spell;
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Group position="apart" mb="md">
        <ActionIcon onClick={() => setSeeDesc(!seeDesc)}>
          {seeDesc ? <EyeglassOff /> : <Eyeglass />}
        </ActionIcon>
        <Text size="xl" style={{ flexGrow: 1 }}>
          {name}
        </Text>
      </Group>
      <Badge m={5}>level: {level}</Badge>
      <Badge m={5}>School: {school.name}</Badge>
      <Badge m={5}>Casting time: {casting_time}</Badge>
      <Badge m={5}>Duration: {duration}</Badge>
      {components && <Badge m={5}>Components: {components.join(' / ')}</Badge>}
      {attack_type && <Badge m={5}>Attack type: {attack_type}</Badge>}
      {area_of_effect && (
        <Badge m={5}>
          Aera: {area_of_effect.size} {area_of_effect.type}
        </Badge>
      )}
      {damage && (
        <Badge m={5}>
          Damage: {damage.damage_type?.name || ''}
          {damage.damage_at_character_level
            ?.map(
              ({ damage, level: characterLevel }) =>
                `lvl${characterLevel}: ${damage}`
            )
            .join(' / ')}
        </Badge>
      )}
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
