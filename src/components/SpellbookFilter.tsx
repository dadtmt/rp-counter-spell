import { ActionIcon, Group, Chip } from '@mantine/core';
import { Book, Book2 } from 'tabler-icons-react';
import { FilterAction, FilterState } from '../reducer/filterReducer';

interface SpellbookFilterProps {
  filterState: FilterState;
  filterDispatch: React.Dispatch<FilterAction>;
}

const SpellbookFilter = ({
  filterState: {
    allLevelsSelected,
    castableSelected,
    nonCastableSelected,
    spellLevels,
  },
  filterDispatch,
}: SpellbookFilterProps) => {
  return (
    <Group position="center">
      <ActionIcon
        variant={castableSelected ? 'gradient' : 'filled'}
        onClick={() => filterDispatch({ type: 'CLICK_CASTABLE' })}
      >
        <Book />
      </ActionIcon>
      <ActionIcon
        variant={nonCastableSelected ? 'gradient' : 'filled'}
        onClick={() => filterDispatch({ type: 'CLICK_NONCASTABLE' })}
      >
        <Book2 />
      </ActionIcon>
      {spellLevels.map(({ level, selected }) => (
        <Chip
          key={level}
          size="xs"
          checked={selected}
          onChange={() =>
            filterDispatch({
              type: 'SELECT_LEVEL',
              clickedLevel: level,
            })
          }
        >
          {level}
        </Chip>
      ))}
      <Chip
        size="xs"
        checked={allLevelsSelected}
        onChange={() => filterDispatch({ type: 'SELECT_ALL_LEVELS' })}
      >
        All
      </Chip>
    </Group>
  );
};

export default SpellbookFilter;
