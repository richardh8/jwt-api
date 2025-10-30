import { Request, Response } from 'express';
import { Animal, CreateAnimalDto, UpdateAnimalDto } from '../types/animal.types.js';
import { animalModel } from '../models/animal.model.js';
import { ApiError } from '../middleware/error.middleware.js';

type CreateAnimalRequest = CreateAnimalDto | CreateAnimalDto[];

class AnimalController {
  async getAllAnimals(req: Request, res: Response): Promise<void> {
    const animals = await animalModel.findAll();
    res.json(animals);
  }

  async getAnimalById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ApiError(400, 'Invalid animal ID');
    }

    const animal = await animalModel.findById(id);
    if (!animal) {
      throw new ApiError(404, 'Animal not found');
    }

    res.json(animal);
  }

  async createAnimal(req: Request, res: Response): Promise<void> {
    const requestData = req.body as CreateAnimalRequest;
    
    // Handle single animal creation
    if (!Array.isArray(requestData)) {
      const newAnimal = await animalModel.create(requestData);
      res.status(201).json(newAnimal);
      return;
    }
    
    // Handle bulk creation
    if (requestData.length === 0) {
      throw new ApiError(400, 'Empty array provided for bulk creation');
    }
    
    const newAnimals = await animalModel.createMany(requestData);
    res.status(201).json(newAnimals);
  }

  async updateAnimal(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ApiError(400, 'Invalid animal ID');
    }

    const updateData: UpdateAnimalDto = req.body;
    const updatedAnimal = await animalModel.update(id, updateData);
    
    if (!updatedAnimal) {
      throw new ApiError(404, 'Animal not found');
    }

    res.json(updatedAnimal);
  }

  async deleteAnimal(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ApiError(400, 'Invalid animal ID');
    }

    const success = await animalModel.delete(id);
    if (!success) {
      throw new ApiError(404, 'Animal not found');
    }

    res.status(200).json({
      success: true,
      message: 'Animal deleted successfully'
    });
  }
}

export const animalController = new AnimalController();
