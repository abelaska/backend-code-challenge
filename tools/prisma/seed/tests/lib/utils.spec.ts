import { stringWithUnitsToNumber, flatten } from '../../src/lib/utils';

describe('utils', () => {
  it('stringWithUnitsToNumber', () => {
    expect(stringWithUnitsToNumber('')).toBe(0);
    expect(stringWithUnitsToNumber('10')).toBe(10);
    expect(stringWithUnitsToNumber('10m')).toBe(10);
    expect(stringWithUnitsToNumber('10kg')).toBe(10);
    expect(stringWithUnitsToNumber('10.12')).toBe(10.12);
    expect(stringWithUnitsToNumber('10.12m')).toBe(10.12);
    expect(stringWithUnitsToNumber('10.12kg')).toBe(10.12);
  });

  it('flatten', () => {
    expect(flatten([])).toEqual([]);
    expect(flatten([[]])).toEqual([]);
    expect(flatten([[], []])).toEqual([]);
    expect(flatten([[], [], []])).toEqual([]);
    expect(flatten([['0']])).toEqual(['0']);
    expect(flatten([['0'], ['1', '2']])).toEqual(['0', '1', '2']);
    expect(flatten([['0'], ['1'], ['2']])).toEqual(['0', '1', '2']);
  });
});
