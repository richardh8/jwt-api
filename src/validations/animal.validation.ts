import Joi from 'joi';

const baseAnimalSchema = {
  name: Joi.string().required().min(2).max(100),
  species: Joi.string().required().min(2).max(100),
  age: Joi.number().integer().min(0).max(1000).required(),
  gender: Joi.string().valid('Male', 'Female').required(),
  race: Joi.string().required().min(2).max(100)
};

export const createAnimalSchema = Joi.object(baseAnimalSchema);

export const createAnimalsSchema = Joi.alternatives().try(
  Joi.object(baseAnimalSchema),
  Joi.array().items(Joi.object(baseAnimalSchema)).min(1)
);

export const updateAnimalSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  species: Joi.string().min(2).max(100),
  age: Joi.number().integer().min(0).max(1000),
  gender: Joi.string().valid('Male', 'Female'),
  race: Joi.string().min(2).max(100)
});
