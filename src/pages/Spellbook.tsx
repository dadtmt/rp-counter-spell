import { ActionIcon, Container, Drawer, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Book, Book2 } from 'tabler-icons-react';
import { CharacterContext } from '../components/Character';
import DisplaySpell from '../components/DisplaySpell';
import { useTitle } from '../components/Layout';
import { Spell } from '../utils/__generated__/dndGraphql';
import { Writtenspells } from '../utils/__generated__/graphql';

export type SpellStateAndData = { spellState: Writtenspells; spellData: Spell };

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
  useEffect(() => {
    setSpells(
      writtenspells.map((spellState) => {
        const spellData: Spell = JSON.parse(spellState.spell_data);
        return { spellState, spellData };
      })
    );
  }, [writtenspells]);
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
      </Drawer>
      <Container>
        {spells
          .filter(
            ({ spellState: { castable } }) =>
              (castable && castableSelected) ||
              (!castable && nonCastableSelected)
          )
          .map((spell) => {
            return <DisplaySpell key={spell.spellState.id} spell={spell} />;
          })}
      </Container>
    </>
  );
};

export default Spellbook;
