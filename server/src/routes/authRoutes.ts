import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { loginValidation, registerValidation } from '../middleware/validation';

const router = Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, authController.register);

// @route   POST api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', loginValidation, authController.login);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, authController.getCurrentUser);

// @route   POST api/auth/logout
// @desc    Logout user / clear token
// @access  Private
router.post('/logout', authenticate, authController.logout);

export default router;
