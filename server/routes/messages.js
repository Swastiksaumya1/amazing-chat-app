const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/Message');

// @route   GET /api/messages/:userId
// @desc    Get messages between current user and another user
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');

    // Mark messages as read
    await Message.updateMany(
      {
        senderId: userId,
        receiverId: currentUserId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get all conversations for the current user
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // Get all unique users that the current user has conversations with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: currentUserId },
            { receiverId: currentUserId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', currentUserId] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $last: '$text' },
          lastMessageTime: { $last: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          lastMessage: 1,
          lastMessageTime: 1
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

module.exports = router;
