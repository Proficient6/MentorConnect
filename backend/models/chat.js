// Chat message model for storing task discussions
const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  // References
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Message content
  message: {
    type: String,
    required: true
  },
  
  // Message metadata
  senderName: {
    type: String,
    default: ''
  },
  senderRole: {
    type: String,
    enum: ['student', 'mentor'],
    default: 'student'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Reactions/Reads
  readBy: [{
    userId: mongoose.Schema.Types.ObjectId,
    readAt: Date
  }]
});

// Index for efficient queries
chatSchema.index({ taskId: 1, createdAt: -1 });

const chatModel = mongoose.model('Chat', chatSchema);

module.exports = chatModel;
