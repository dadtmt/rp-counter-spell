import { ActionIcon, Drawer, Group, Text, Switch } from '@mantine/core';
import { useOutletContext } from 'react-router-dom';
import { Book, Book2 } from 'tabler-icons-react';
import { CharacterContext } from './Character';

const SpellbookFilter = () => {
  const {
    filterOpened,
    setFilterOpened,
    filterState: {
      allLevelsSelected,
      castableSelected,
      nonCastableSelected,
      spellLevels,
    },
    filterDispatch,
  } = useOutletContext<CharacterContext>();
  return (
    <Drawer
      opened={filterOpened}
      onClose={() => setFilterOpened(false)}
      title="Filter"
      padding="xl"
      size="xl"
    >
      <Group position="center">
        <Text>Prepared: </Text>
        <ActionIcon
          variant={castableSelected ? 'subtle' : 'outline'}
          onClick={() => filterDispatch({ type: 'CLICK_CASTABLE' })}
        >
          <Book />
        </ActionIcon>
        <ActionIcon
          variant={nonCastableSelected ? 'subtle' : 'outline'}
          onClick={() => filterDispatch({ type: 'CLICK_NONCASTABLE' })}
        >
          <Book2 />
        </ActionIcon>
      </Group>
      <Group position="center" mt="lg">
        <Switch
          label="All Levels"
          checked={allLevelsSelected}
          onChange={() => filterDispatch({ type: 'SELECT_ALL_LEVELS' })}
        />
        {spellLevels.map(
          ({ level: switchSpellLevel, selected: switchSelected }) => (
            <Switch
              key={switchSpellLevel}
              label={switchSpellLevel}
              checked={switchSelected}
              onChange={() => {
                filterDispatch({
                  type: 'SELECT_LEVEL',
                  clickedLevel: switchSpellLevel,
                });
              }}
            />
          )
        )}
      </Group>
      <Group position="center" mt="lg">
        Double select is select only
      </Group>
    </Drawer>
  );
};

export default SpellbookFilter;
