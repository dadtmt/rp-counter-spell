import { Spell } from '../utils/__generated__/dndGraphql';
import { Writtenspells } from '../utils/__generated__/graphql';

type SpellState = Pick<
  Writtenspells,
  'castable' | 'id' | 'dndindex' | 'spell_data'
>;

export type SpellData = Pick<
  Spell,
  | 'name'
  | 'desc'
  | 'level'
  | 'attack_type'
  | 'school'
  | 'area_of_effect'
  | 'casting_time'
  | 'components'
  | 'duration'
  | 'range'
  | 'concentration'
  | 'ritual'
  | 'dc'
  | 'higher_level'
  | 'damage'
  | 'heal_at_slot_level'
  | 'material'
>;

export type SpellStateAndData = {
  spellState: SpellState;
  spellData: SpellData;
};

type LevelSelected = { level: number; selected: boolean };

export type FilterState = {
  castableSelected: boolean;
  nonCastableSelected: boolean;
  allLevelsSelected: boolean;
  spellLevels: LevelSelected[];
  spells: SpellStateAndData[];
  filteredSpells: SpellStateAndData[];
};

export type FilterAction =
  | { type: 'SET_SPELLS'; writtenspells: SpellState[] }
  | { type: 'CLICK_CASTABLE' }
  | { type: 'CLICK_NONCASTABLE' }
  | { type: 'SELECT_ALL_LEVELS' }
  | { type: 'SELECT_LEVEL'; clickedLevel: number };

const setAllLevels = (state: FilterState): FilterState => {
  const { spellLevels } = state;
  return {
    ...state,
    allLevelsSelected: !spellLevels.find(({ selected }) => !selected),
  };
};
const setSpellLevels = (state: FilterState): FilterState => {
  const { spells, spellLevels } = state;
  const levelsFromSpells = Array.from(
    new Set(spells.map(({ spellData: { level } }) => level))
  ).sort();
  return setAllLevels({
    ...state,
    spellLevels: levelsFromSpells.map((level) => {
      const matchingSpellLevel = spellLevels.find(
        ({ level: spellLevel }) => spellLevel === level
      );
      return matchingSpellLevel || { level, selected: true };
    }),
  });
};

const compareSpell = (a: SpellStateAndData, b: SpellStateAndData) =>
  a.spellData.level - b.spellData.level ||
  a.spellData.name.localeCompare(b.spellData.name);

const castableFilter =
  ({ castableSelected, nonCastableSelected }: FilterState) =>
  ({ spellState: { castable } }: SpellStateAndData) =>
    (castable && castableSelected) || (!castable && nonCastableSelected);

const levelFilter =
  ({ spellLevels }: FilterState) =>
  ({ spellData: { level } }: SpellStateAndData) =>
    spellLevels.filter(({ level: lvl, selected }) => lvl === level && selected)
      .length > 0;

const filterSpells = (state: FilterState): FilterState => {
  const { spells } = state;
  return {
    ...state,
    filteredSpells: spells
      .filter(
        (spell) => castableFilter(state)(spell) && levelFilter(state)(spell)
      )
      .sort(compareSpell),
  };
};

const setSpells = (state: FilterState, writtenspells: SpellState[]) => {
  return setSpellLevels({
    ...state,
    spells: writtenspells.map((spellState) => {
      const spellData: Spell = JSON.parse(spellState.spell_data);
      return { spellState, spellData };
    }),
  });
};

const uiReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_SPELLS': {
      return setSpells(state, action.writtenspells);
    }
    case 'CLICK_CASTABLE': {
      const { castableSelected } = state;
      return {
        ...state,
        castableSelected: true,
        nonCastableSelected: !castableSelected,
      };
    }
    case 'CLICK_NONCASTABLE': {
      const { nonCastableSelected } = state;
      return {
        ...state,
        castableSelected: !nonCastableSelected,
        nonCastableSelected: true,
      };
    }
    case 'SELECT_ALL_LEVELS': {
      const { spellLevels } = state;
      return {
        ...state,
        allLevelsSelected: true,
        spellLevels: spellLevels.map(({ level }) => ({
          level,
          selected: true,
        })),
      };
    }
    case 'SELECT_LEVEL': {
      const { spellLevels } = state;
      const manyLevelSelected =
        spellLevels.find(
          ({ level, selected }) => action.clickedLevel === level && selected
        ) && spellLevels.filter(({ selected }) => selected).length > 1;
      return setAllLevels({
        ...state,
        spellLevels: manyLevelSelected
          ? spellLevels.map(({ level }) => ({
              level,
              selected: level === action.clickedLevel,
            }))
          : spellLevels.map(({ level, selected }) => ({
              level,
              selected: level === action.clickedLevel || selected,
            })),
      });
    }
  }
};

const filterReducer = (state: FilterState, action: FilterAction): FilterState =>
  filterSpells(uiReducer(state, action));

export default filterReducer;
