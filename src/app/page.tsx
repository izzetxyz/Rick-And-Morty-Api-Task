import Image from 'next/image';
import { CharacterCard,Info } from '../../components/models/types';
import { fetchCharacters,fetchInfo } from '../../components/utils/useApi';
import  ClientComponent  from '../../components/Client/Home'
interface Props {
  cards: CharacterCard[];
  info: Info[];
}

export default async function Home() {
  const cards: CharacterCard[] = await fetchCharacters();
  const info: Info[] = await fetchInfo();
  return (
    <main className="min-h-screen flex flex-col bg-gray-100 p-4">
      <ClientComponent initialCards={cards} InfoCards={info} />
    </main>
  );
}
