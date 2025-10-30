import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from './error.middleware.js';

type AnySchema = Joi.AnySchema;

export const validate = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Validating request body:', req.body);
      
      const { error, value } = schema.validate(req.body, { 
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });

      if (error) {
        console.error('Validation errors:', error.details);
        const errorMessages = error.details.map((detail: Joi.ValidationErrorItem) => ({
          message: detail.message,
          path: (detail.path || []).join('.'),
          type: detail.type,
          context: detail.context
        }));

        throw new ApiError(400, 'Validation failed', errorMessages);
      }

      // Replace request body with validated value
      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  };
};