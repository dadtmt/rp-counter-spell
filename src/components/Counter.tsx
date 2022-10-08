import { Button, NumberInput } from '@mantine/core';
import { useState } from 'react';
import { useIncCounterMutation } from '../utils/__generated__/graphql';

interface CounterProps {
  id: number;
  name: string;
  initial_value: number;
  current_value: number;
}

const Counter = ({ id, name, initial_value, current_value }: CounterProps) => {
  const [inc, setInc] = useState(1);
  const [mutateIncCounter] = useIncCounterMutation();
  const incSubmit = (increment: boolean) => {
    mutateIncCounter({
      variables: {
        id,
        inc: increment ? inc : -inc,
      },
    });
  };
  return (
    <li>
      {name}: {current_value || initial_value}/{initial_value}
      <Button onClick={() => incSubmit(false)}>-</Button>
      <NumberInput value={inc} onChange={(val) => setInc(val || 1)} />
      <Button onClick={() => incSubmit(true)}>+</Button>
    </li>
  );
};

export default Counter;
