export interface Animal {
  id?: number;
  name: string;
  species: string;
  age: number;
  gender: string;
  race: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnimalFilters {
  name?: string;
  species?: string;
  race?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  q?: string; // Search query parameter
}
