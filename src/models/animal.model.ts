import { Animal, CreateAnimalDto, UpdateAnimalDto } from '../types/animal.types.js';

class AnimalModel {
  private animals: Animal[] = [];
  private idCounter = 1;  // Track the next available ID
  
  private getNextId(): number {
    if (this.animals.length === 0) return this.idCounter;
    return Math.max(this.idCounter, ...this.animals.map(a => a.id)) + 1;
  }
  
  async createMany(animalsData: CreateAnimalDto[]): Promise<Animal[]> {
    const now = new Date();
    
    // Get the next available ID for the first animal
    let nextId = this.getNextId();
    
    // Create all animals with sequential IDs
    const newAnimals = animalsData.map((animalData, index) => ({
      ...animalData,
      id: nextId + index,  // Increment ID for each animal
      createdAt: now,
      updatedAt: now,
    }));
    
    // Update the idCounter to be after the last created animal
    if (newAnimals.length > 0) {
      // Set the next ID to be one more than the last created animal
      this.animals.push(...newAnimals);
      // Update the internal counter to prevent ID conflicts
      this.idCounter = newAnimals[newAnimals.length - 1].id + 1;
    }
    
    return newAnimals;
  }

  async findAll(): Promise<Animal[]> {
    return [...this.animals];
  }

  async findById(id: number): Promise<Animal | undefined> {
    return this.animals.find(animal => animal.id === id);
  }

  async create(animalData: CreateAnimalDto): Promise<Animal> {
    const now = new Date();
    const newAnimal: Animal = {
      ...animalData,
      id: this.getNextId(),
      createdAt: now,
      updatedAt: now,
    };
    
    this.animals.push(newAnimal);
    return newAnimal;
  }

  async update(id: number, updateData: UpdateAnimalDto): Promise<Animal | null> {
    const index = this.animals.findIndex(animal => animal.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedAnimal = {
      ...this.animals[index],
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    this.animals[index] = updatedAnimal;
    return updatedAnimal;
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.animals.length;
    this.animals = this.animals.filter(animal => animal.id !== id);
    return this.animals.length < initialLength;
  }

  async search(query: string): Promise<Animal[]> {
    console.log('Searching for:', query);
    
    if (!query) {
      console.log('No query provided, returning all animals');
      return this.findAll();
    }

    const searchTerm = query.toLowerCase();
    console.log('Search term (lowercase):', searchTerm);
    console.log('Total animals:', this.animals.length);
    
    const results = this.animals.filter(animal => {
      const fieldsToSearch = [
        animal.name,
        animal.species,
        animal.race,
        animal.gender
      ];
      
      const matches = fieldsToSearch.some(field => {
        if (!field) return false;
        const fieldLower = field.toLowerCase();
        const hasMatch = fieldLower.includes(searchTerm);
        if (hasMatch) {
          console.log(`Match found in animal ${animal.id} (${animal.name}):`, {
            field,
            searchTerm,
            fieldLower
          });
        }
        return hasMatch;
      });
      
      return matches;
    });
    
    console.log(`Found ${results.length} matching animals`);
    return results;
  }
}

export const animalModel = new AnimalModel();
