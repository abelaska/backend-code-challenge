export const stringWithUnitsToNumber = (s: string): number => parseFloat(/^([0-9.]+)\w*$/.exec(s)?.[1] ?? '0');

export const flatten = <T>(arrays: T[][]): T[] => arrays.reduce((list, sublist) => list.concat(sublist), []);
