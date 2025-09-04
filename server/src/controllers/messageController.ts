import { Request, Response } from 'express';
import Message from '../models/Message';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validationResult } = require('express-validator');

export const sendMessage = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { receiverId, content } = req.body;
  const senderId = req.user._id;

  try {
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await message.save();

    // Populate sender and receiver details
    const populatedMessage = await Message.populate(message, [
      { path: 'sender', select: 'username' },
      { path: 'receiver', select: 'username' },
    ]);

    // Emit the new message to the receiver
    req.app.get('io').to(receiverId).emit('newMessage', {
      message: populatedMessage,
      from: senderId,
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .populate('receiver', 'username');

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        isRead: false,
      },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user._id;

    // Get all unique users that the current user has chatted with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserId }, { receiver: currentUserId }],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [{ $eq: ['$sender', currentUserId] }, '$receiver', '$sender'],
          },
          lastMessage: '$$ROOT',
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
      {
        $group: {
          _id: '$otherUser',
          lastMessage: { $first: '$lastMessage' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$lastMessage.receiver', currentUserId] },
                    { $eq: ['$lastMessage.isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0,
          'user.__v': 0,
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};
