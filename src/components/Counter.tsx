import {
  ActionIcon,
  Badge,
  Card,
  Group,
  NumberInput,
  Progress,
  Text,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { Abacus, EditCircle, Minus, Plus } from 'tabler-icons-react';
import { useIncCounterMutation } from '../utils/__generated__/graphql';

interface CounterProps {
  id: number;
  name: string;
  initial_value: number;
  current_value: number;
}

const Counter = ({ id, name, initial_value, current_value }: CounterProps) => {
  const [inc, setInc] = useState(1);
  const [mutateIncCounter, { loading }] = useIncCounterMutation();
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
        <ActionIcon onClick={() => reInitialize()} disabled={loading}>
          <Abacus />
        </ActionIcon>
        <ActionIcon>
          <EditCircle />
        </ActionIcon>
        <Text size="xl" style={{ flexGrow: 1 }}>
          {name}
        </Text>
        <Badge size="xl">
          {current_value}/{initial_value}
        </Badge>
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
