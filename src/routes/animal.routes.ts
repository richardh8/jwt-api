import { Router } from 'express';
import { animalController } from '../controllers/animal.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createAnimalSchema, createAnimalsSchema, updateAnimalSchema } from '../validations/animal.validation.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all animals
router.get('/', async (req, res, next) => {
  try {
    await animalController.getAllAnimals(req, res);
  } catch (error) {
    next(error);
  }
});

// Get animal by ID
router.get('/:id', async (req, res, next) => {
  try {
    await animalController.getAnimalById(req, res);
  } catch (error) {
    next(error);
  }
});

// Create a new animal or multiple animals
router.post('/', validate(createAnimalsSchema), async (req, res, next) => {
  try {
    await animalController.createAnimal(req, res);
  } catch (error) {
    next(error);
  }
});

// Update an existing animal
router.put('/:id', validate(updateAnimalSchema), async (req, res, next) => {
  try {
    await animalController.updateAnimal(req, res);
  } catch (error) {
    next(error);
  }
});

// Delete an animal
router.delete('/:id', async (req, res, next) => {
  try {
    await animalController.deleteAnimal(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;