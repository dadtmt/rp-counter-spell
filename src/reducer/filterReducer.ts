import { Spell } from '../utils/__generated__/dndGraphql';
import { Writtenspells } from '../utils/__generated__/graphql';

export type SpellStateAndData = { spellState: Writtenspells; spellData: Spell };

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
  | { type: 'SET_SPELLS'; writtenspells: Writtenspells[] }
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
  const { castableSelected, nonCastableSelected, spells } = state;
  return setAllLevels({
    ...state,
    spellLevels: Array.from(
      new Set(
        spells
          .filter(
            ({ spellState: { castable } }) =>
              (castable && castableSelected) ||
              (!castable && nonCastableSelected)
          )
          .map(({ spellData: { level } }) => level)
      )
    )
      .sort()
      .map((level) => ({ level, selected: true })),
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

const uiReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_SPELLS': {
      return setSpellLevels({
        ...state,
        spells: action.writtenspells.map((spellState) => {
          const spellData: Spell = JSON.parse(spellState.spell_data);
          return { spellState, spellData };
        }),
      });
    }
    case 'CLICK_CASTABLE': {
      const { castableSelected } = state;
      return setSpellLevels({
        ...state,
        castableSelected: true,
        nonCastableSelected: !castableSelected,
      });
    }
    case 'CLICK_NONCASTABLE': {
      const { nonCastableSelected } = state;
      return setSpellLevels({
        ...state,
        castableSelected: !nonCastableSelected,
        nonCastableSelected: true,
      });
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
