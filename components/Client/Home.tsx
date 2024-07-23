'use client'; // Client Component olarak işaretle

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CharacterCard, Info } from '../../components/models/types';

interface ClientComponentProps {
    initialCards: CharacterCard[];
    InfoCards: Info;
}

export default function ClientComponent({ initialCards, InfoCards }: ClientComponentProps) {
    const [cards, setCards] = useState<CharacterCard[]>(initialCards);
    const [info, setInfo] = useState<Info>(InfoCards);
    const [filter, setFilter] = useState<string>('all');
    const [episodeNames, setEpisodeNames] = useState<Record<number, string>>({});
    const [selectedLocationResidents, setSelectedLocationResidents] = useState<CharacterCard[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

    useEffect(() => {
        const fetchEpisodeNames = async () => {
            const names: Record<number, string> = {};
            const fetchPromises = cards.map(async (card) => {
                if (card.episode.length > 0) {
                    const episodeUrl = card.episode[0];
                    try {
                        const response = await fetch(episodeUrl);
                        if (response.ok) {
                            const data = await response.json();
                            names[card.id] = data.name;
                        } else {
                            console.error(`Failed to fetch episode at ${episodeUrl}`);
                        }
                    } catch (error) {
                        console.error('Failed to fetch episode:', error);
                    }
                }
            });
            await Promise.all(fetchPromises);
            setEpisodeNames(names);
        };

        fetchEpisodeNames();
    }, [cards]);

    const handleLocationClick = async (locationUrl: string) => {
        try {
            const response = await fetch(locationUrl);
            const data = await response.json();
            const residentPromises = data.residents.map(async (residentUrl: string) => {
                const residentResponse = await fetch(residentUrl);
                if (residentResponse.ok) {
                    return residentResponse.json();
                } else {
                    console.error(`Failed to fetch resident at ${residentUrl}`);
                    return null;
                }
            });

            const residents = await Promise.all(residentPromises);
            const validResidents = residents.filter((resident): resident is CharacterCard => resident !== null);
            setSelectedLocationResidents(validResidents);
            setSelectedLocation(data.name);
            setCards(validResidents);
        } catch (error) {
            console.error('Failed to fetch location:', error);
        }
    };

    const filteredCards = cards.filter(card =>
        filter === 'all' || card.status.toLowerCase() === filter
    );

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };

    function getStatusColor(status: string) {
        switch (status.toLowerCase()) {
            case 'alive':
                return 'green';
            case 'dead':
                return 'red';
            case 'unknown':
                return 'gray';
            default:
                return 'gray';
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-center mb-8">The Rick and Morty API</h1>
            <div className="flex justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <label htmlFor="filter" className="text-lg font-semibold">Filter:</label>
                    <select
                        id="filter"
                        className="p-2 border rounded"
                        value={filter}
                        onChange={handleFilterChange}
                    >
                        <option value="all">All</option>
                        <option value="alive">Alive</option>
                        <option value="dead">Dead</option>
                    </select>
                    <button
                        className="p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => window.location.reload()}
                    >
                        Remove Filters
                    </button>
                </div>
                <div className="text-lg font-semibold">
                    Total Characters: {info.count}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCards.map((card: CharacterCard) => (
                    <div key={card.id} className="bg-white rounded-lg shadow-lg flex">
                        <div className="flex-shrink-0 w-1/4">
                            <Image
                                src={card.image}
                                alt={card.name}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover rounded-l-lg"
                            />
                        </div>
                        <div className="flex-1 p-4">
                            <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
                            <p>{card.species}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-bold">Last Known Location:</span>
                                <button
                                    className="text-blue-500 underline ml-2 font-normal"
                                    onClick={() => handleLocationClick(card.location.url)}
                                >
                                    {card.location.name}
                                </button>
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-bold">First Seen In:</span> {episodeNames[card.id] || 'Loading...'}
                            </p>

                            <div className="flex items-center mt-2">
                                <p className="text-sm text-gray-600 mr-2  font-bold">Status:</p>
                                <p
                                    className={`text-sm mr-2`}
                                    style={{ color: `${getStatusColor(card.status)}` }}
                                >{card.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
