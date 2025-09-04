import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validationResult } = require('express-validator');
import User from '../models/User';
import { Types } from 'mongoose';

type UserData = {
  _id: string;
  username: string;
  email: string;
  isOnline: boolean;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({
        message: 'User already exists with this email or username',
      });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = generateToken((user._id as Types.ObjectId).toString());

    // Return user data without password
    const userData = user.toObject() as UserData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = userData;

    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update user's online status
    user.isOnline = true;
    await user.save();

    // Generate token
    const token = generateToken((user._id as Types.ObjectId).toString());

    // Return user data without password
    const userData = user.toObject() as UserData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = userData;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Update user's online status
    await User.findByIdAndUpdate(req.user._id, { isOnline: false });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};
