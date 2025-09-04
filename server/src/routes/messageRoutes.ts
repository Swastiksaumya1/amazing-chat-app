import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { authenticate } from '../middleware/auth';
import { messageValidation, userIdParamValidation } from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', messageValidation, messageController.sendMessage);

// @route   GET /api/messages/conversations
// @desc    Get all conversations for the current user
// @access  Private
router.get('/conversations', messageController.getConversations);

// @route   GET /api/messages/:userId
// @desc    Get messages between current user and another user
// @access  Private
router.get('/:userId', userIdParamValidation, messageController.getMessages);

export default router;
