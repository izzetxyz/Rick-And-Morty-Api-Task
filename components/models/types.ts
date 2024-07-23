
export interface CharacterCard {
    id: number;
    name: string;
    image: string;
    species: string;
    status: string;
    episode: string[];
    location: {
        name: string; 
        url: string;
    };
    
  }
  export interface Info {
    count: number;
    pages: number;

  }
  