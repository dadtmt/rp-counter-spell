import {
  ActionIcon,
  Container,
  Drawer,
  Group,
  Text,
  Switch,
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Book, Book2 } from 'tabler-icons-react';
import { CharacterContext } from '../components/Character';
import DisplaySpell from '../components/DisplaySpell';
import { useTitle } from '../components/Layout';
import { Spell } from '../utils/__generated__/dndGraphql';
import { Writtenspells } from '../utils/__generated__/graphql';

export type SpellStateAndData = { spellState: Writtenspells; spellData: Spell };
type LevelSelected = { level: number; selected: boolean };

const compareSpell = (a: SpellStateAndData, b: SpellStateAndData) =>
  a.spellData.level - b.spellData.level ||
  a.spellData.name.localeCompare(b.spellData.name);

const Spellbook = () => {
  const {
    character: { writtenspells, name },
    filterOpened,
    setFilterOpened,
  } = useOutletContext<CharacterContext>();
  useTitle(`${name} Spellbook`);
  const [spells, setSpells] = useState<SpellStateAndData[]>([]);
  const [castableSelected, setCastableSelected] = useState(true);
  const [nonCastableSelected, setNonCastableSelected] = useState(false);
  const [spellLevels, setSpellLevels] = useState<LevelSelected[]>([]);
  const [allLevelsSelected, setAllLevelsSelected] = useState(true);

  const filterByCastableSelection = useCallback(
    (castable: boolean) =>
      (castable && castableSelected) || (!castable && nonCastableSelected),
    [castableSelected, nonCastableSelected]
  );

  useEffect(() => {
    setSpells(
      writtenspells.map((spellState) => {
        const spellData: Spell = JSON.parse(spellState.spell_data);
        return { spellState, spellData };
      })
    );
  }, [writtenspells]);
  useEffect(() => {
    setSpellLevels(
      Array.from(
        new Set(
          spells
            .filter(({ spellState: { castable } }) =>
              filterByCastableSelection(castable)
            )
            .map(({ spellData: { level } }) => level)
        )
      )
        .sort()
        .map((level) => ({ level, selected: true }))
    );
  }, [spells, filterByCastableSelection]);

  useEffect(() => {
    if (spellLevels.find(({ selected }) => !selected)) {
      setAllLevelsSelected(false);
    } else {
      setAllLevelsSelected(true);
    }
  }, [spellLevels]);
  return (
    <>
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
            onClick={() =>
              setCastableSelected((s) => (!nonCastableSelected ? true : !s))
            }
          >
            <Book />
          </ActionIcon>
          <ActionIcon
            variant={nonCastableSelected ? 'subtle' : 'outline'}
            onClick={() =>
              setNonCastableSelected((s) => (!castableSelected ? true : !s))
            }
          >
            <Book2 />
          </ActionIcon>
        </Group>
        <Group position="center">
          <Switch
            label="All"
            checked={allLevelsSelected}
            onChange={() => {
              if (!allLevelsSelected) {
                setSpellLevels((prevSpellLevels) =>
                  prevSpellLevels.map(({ level }) => ({
                    level,
                    selected: true,
                  }))
                );
              }
            }}
          />
          {spellLevels.map(
            ({ level: switchSpellLevel, selected: switchSelected }) => (
              <Switch
                key={switchSpellLevel}
                label={switchSpellLevel}
                checked={switchSelected}
                onChange={() => {
                  if (
                    spellLevels.find(
                      ({ level, selected }) =>
                        switchSpellLevel === level && selected
                    ) &&
                    spellLevels.filter(({ selected }) => selected).length > 1
                  ) {
                    setSpellLevels((prevSpellLevels) =>
                      prevSpellLevels.map(({ level }) => ({
                        level,
                        selected: level === switchSpellLevel,
                      }))
                    );
                  } else {
                    setSpellLevels((prevSpellLevels) =>
                      prevSpellLevels.map(({ level, selected }) => ({
                        level,
                        selected: level === switchSpellLevel || selected,
                      }))
                    );
                  }
                }}
              />
            )
          )}
        </Group>
      </Drawer>
      <Container>
        {[
          ...spells.filter(({ spellState: { castable } }) =>
            filterByCastableSelection(castable)
          ),
        ]
          .sort(compareSpell)
          .map((spell) => {
            return <DisplaySpell key={spell.spellState.id} spell={spell} />;
          })}
      </Container>
    </>
  );
};

export default Spellbook;
