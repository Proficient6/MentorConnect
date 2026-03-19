// Video chat request model
const mongoose = require('mongoose');

const videoChatSchema = mongoose.Schema({
  // References
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Request details
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  
  // Video chat session details
  sessionId: {
    type: String,
    default: null
  },
  token: {
    type: String,
    default: null
  },
  
  // Timestamps
  requestedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date,
    default: null
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  
  // Response message
  mentorResponse: {
    type: String,
    default: null
  }
});

const videoChatModel = mongoose.model('VideoChat', videoChatSchema);

module.exports = videoChatModel;
