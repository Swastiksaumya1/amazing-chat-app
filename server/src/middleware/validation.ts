// eslint-disable-next-line @typescript-eslint/no-var-requires
const { body, param } = require('express-validator');

export const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^\w+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('password').notEmpty().withMessage('Password is required'),
];

export const messageValidation = [
  body('receiverId')
    .notEmpty()
    .withMessage('Receiver ID is required')
    .isMongoId()
    .withMessage('Invalid receiver ID'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 2000 })
    .withMessage('Message cannot be longer than 2000 characters'),
];

export const userIdParamValidation = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
];
