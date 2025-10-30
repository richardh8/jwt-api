import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';

const router = Router();

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authController.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authController.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
