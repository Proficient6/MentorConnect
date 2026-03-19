// Team chat model for team discussions
const mongoose = require('mongoose');

const teamChatSchema = mongoose.Schema({
  // References
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
    index: true
  },
  
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
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
  
  // Sender details (denormalized for faster queries)
  senderName: {
    type: String,
    default: ''
  },
  
  senderRole: {
    type: String,
    enum: ['student', 'mentor'],
    default: 'student'
  },
  
  // Message metadata
  messageType: {
    type: String,
    enum: ['text', 'file', 'task_update', 'deadline_reminder'],
    default: 'text'
  },
  
  fileUrl: {
    type: String,
    default: null
  },
  
  // Reactions and engagement
  reactions: [{
    userId: mongoose.Schema.Types.ObjectId,
    emoji: String
  }],
  
  isPinned: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
teamChatSchema.index({ teamId: 1, createdAt: -1 });
teamChatSchema.index({ taskId: 1, createdAt: -1 });

const teamChatModel = mongoose.model('TeamChat', teamChatSchema);

module.exports = teamChatModel;
