export type Gender = 'Male' | 'Female';

export interface Animal {
  id: number;
  name: string;
  species: string;
  age: number;
  gender: Gender;
  race: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAnimalDto = Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAnimalDto = Partial<CreateAnimalDto>;
