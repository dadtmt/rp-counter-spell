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
import { Link } from 'react-router-dom';
import { Abacus, EditCircle, Minus, Plus } from 'tabler-icons-react';
import {
  Counters,
  useIncCounterMutation,
} from '../utils/__generated__/graphql';

type CounterProps = Pick<
  Counters,
  'id' | 'name' | 'initial_value' | 'current_value'
>;

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
    <Card shadow="xs" p="lg" radius="md" withBorder my="xl">
      <Text size="xl">{name}</Text>

      <Group position="apart" my="xl">
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
        <Progress
          value={(current_value / initial_value) * 100}
          style={{ flexGrow: 1 }}
        />
        <Badge size="xl">
          {current_value} / {initial_value}
        </Badge>
      </Group>

      <Group mt="xl" position="center">
        <ActionIcon onClick={() => incSubmit(false)} disabled={loading}>
          <Minus />
        </ActionIcon>
        <Group position="center" style={{ width: '60px' }}>
          <NumberInput
            value={inc}
            onChange={(val) => setInc(val || 1)}
            size="xs"
          />
        </Group>
        <ActionIcon onClick={() => incSubmit(true)} disabled={loading}>
          <Plus />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default Counter;
