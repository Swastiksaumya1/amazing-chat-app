import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying of messages between two users
messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });

const Message = model<IMessage>('Message', messageSchema);

export default Message;
