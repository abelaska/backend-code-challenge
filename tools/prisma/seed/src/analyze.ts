// Simple tool that helped me to analyze the seed dataset

import { join } from 'path';
import { readFileSync } from 'fs';
import type { Pokemon } from '.';

const pokemons: Pokemon[] = JSON.parse(readFileSync(join(__dirname, '..', 'pokemons.json'), 'utf-8'));

const attackCategories = pokemons
  .map((poke) => Object.keys(poke.attacks))
  .reduce((set, categories) => categories.map((category) => set.add(category))[0], new Set());
console.log('attack categories', attackCategories);

const weightUnits = pokemons
  .map((poke) => [poke.weight.minimum, poke.weight.maximum].map((w) => /[0-9]+(\w+)$/.exec(w)?.[1]).filter(Boolean))
  .reduce((set, units) => units.map((category) => set.add(category))[0], new Set());
console.log('weight units', weightUnits);

const heightUnits = pokemons
  .map((poke) => [poke.height.minimum, poke.height.maximum].map((w) => /[0-9]+(\w+)$/.exec(w)?.[1]).filter(Boolean))
  .reduce((set, units) => units.map((category) => set.add(category))[0], new Set());
console.log('height units', heightUnits);

const uniquePokemonNames = pokemons.reduce((set, { name }) => set.add(name), new Set());
console.log('unique names count', uniquePokemonNames.size, 'total pokemons count', pokemons.length);
