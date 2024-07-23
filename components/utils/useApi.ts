
import { Result } from 'postcss';
import { CharacterCard,Info } from '../models/types';

export const fetchCharacters = async (): Promise<CharacterCard[]> => {
  const res = await fetch('https://rickandmortyapi.com/api/character/?page=1');
  const json = await res.json();

  return json.results; 
};
export const fetchInfo = async (): Promise<Info[]> => {
  const res = await fetch('https://rickandmortyapi.com/api/character/?page=1');
  const json = await res.json();

  return json.info;
};
