import {
  ActionIcon,
  Badge,
  Card,
  Group,
  NumberInput,
  Progress,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Abacus, EditCircle, Eraser, Minus, Plus } from 'tabler-icons-react';
import {
  GetCharacterDocument,
  GetCharacterQuery,
  useDeleteCounterMutation,
  useIncCounterMutation,
} from '../utils/__generated__/graphql';
import { CharacterContext } from './Character';

interface CounterProps {
  id: number;
  name: string;
  initial_value: number;
  current_value: number;
}

const Counter = ({ id, name, initial_value, current_value }: CounterProps) => {
  const {
    character: { id: characterId },
  } = useOutletContext<CharacterContext>();
  const [inc, setInc] = useState(1);
  const [mutateIncCounter, { loading }] = useIncCounterMutation();
  const [mutateDelCounter] = useDeleteCounterMutation({
    variables: { id },
    update: (cache) => {
      const queryOptions = {
        query: GetCharacterDocument,
        variables: { id: characterId },
      };
      const data = cache.readQuery(queryOptions) as GetCharacterQuery;
      const characterData = data?.characters_by_pk;
      const counters = characterData?.counters || [];
      cache.writeQuery({
        ...queryOptions,
        data: {
          ...data,
          characters_by_pk: {
            ...characterData,
            counters: counters.filter(({ id: cid }) => id !== cid),
          },
        },
      });
    },
  });
  const incSubmit = (increment: boolean) => {
    mutateIncCounter({
      variables: {
        id,
        inc: increment ? inc : -inc,
      },
    });
  };
  const reInitialize = () => {
    mutateIncCounter({ variables: { id, inc: initial_value - current_value } });
  };
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Progress value={(current_value / initial_value) * 100} mb="xl" />
      <Group position="apart">
        <ActionIcon
          onClick={() => reInitialize()}
          disabled={loading || current_value === initial_value}
        >
          <Abacus />
        </ActionIcon>
        <Link to={`counter/${id.toString()}`}>
          <ActionIcon>
            <EditCircle />
          </ActionIcon>
        </Link>
        <Text size="xl" style={{ flexGrow: 1 }}>
          {name}
        </Text>
        <Badge size="xl">
          {current_value} / {initial_value}
        </Badge>
        <ActionIcon onClick={() => mutateDelCounter()}>
          <Eraser />
        </ActionIcon>
      </Group>
      <Group mt="xl" position="center">
        <ActionIcon onClick={() => incSubmit(false)} disabled={loading}>
          <Minus />
        </ActionIcon>
        <NumberInput
          value={inc}
          onChange={(val) => setInc(val || 1)}
          size="xs"
        />
        <ActionIcon onClick={() => incSubmit(true)} disabled={loading}>
          <Plus />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default Counter;
