// Badge model for user achievements
const mongoose = require('mongoose');

const badgeSchema = mongoose.Schema({
  // Badge details
  name: {
    type: String,
    required: true,
    unique: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  icon: {
    type: String,
    default: '🏆'
  },
  
  // Badge criteria
  criteria: {
    type: {
      type: String,
      enum: ['tasks_completed', 'submissions_reviewed', 'team_contributions', 'mentor_score', 'first_task'],
      required: true
    },
    threshold: {
      type: Number,
      default: 1
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
});

const badgeModel = mongoose.model('Badge', badgeSchema);

module.exports = badgeModel;

// User badge association schema (stored in User model as an array)
const userBadgeSchema = mongoose.Schema({
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  },
  earnedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports.userBadgeSchema = userBadgeSchema;
