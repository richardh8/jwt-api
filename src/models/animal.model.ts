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
    console.log('Before deletion - Animals:', this.animals);
    console.log('Deleting animal with ID:', id);
    
    const initialLength = this.animals.length;
    this.animals = this.animals.filter(animal => {
      console.log(`Checking animal ID: ${animal.id}, type: ${typeof animal.id}, match: ${animal.id !== id}`);
      return animal.id !== id;
    });
    
    console.log('After deletion - Animals:', this.animals);
    return this.animals.length < initialLength;
  }
}

export const animalModel = new AnimalModel();
