# MentorConnect - Advanced Features Integration Guide

## 📋 Overview

This guide covers all the new advanced features integrated into MentorConnect in this session:

1. **WebRTC Video Calling** - Real-time peer-to-peer video calls between mentors and students
2. **Team Chat with Socket.io** - Real-time team messaging and collaboration
3. **Notifications System** - Database-driven user notifications
4. **Badges System** - Achievement tracking for users
5. **Enhanced Mentor Dashboard** - View and manage team applications for tasks

---

## 🎬 WebRTC Video Call Integration

### Components
- **File**: `client/src/components/VideoCall.jsx`
- **Database Model**: `backend/models/videoChat.js`

### Features
- ✅ Peer-to-peer video/audio streaming
- ✅ Screen sharing capability
- ✅ Mic and video toggle controls
- ✅ Call duration tracking
- ✅ Real-time statistics (bitrate, latency, packet loss)
- ✅ Picture-in-picture support

### Usage
```jsx
import VideoCall from './components/VideoCall';

// In your component:
<VideoCall 
  sessionId={sessionId}
  userData={userData}
  mentorData={mentorData}
  onClose={handleClose}
/>
```

### Backend API Endpoints
```
POST /tasks/:id/request-video-chat
  - Request a video chat session
  - Body: { reason, mentorId }
  
POST /video-chat/:sessionId/complete
  - Mark video chat as complete
  - Body: { duration }
```

### Socket.io Events
```javascript
// Emitted by client
io.emit('video-chat-request', {
  videoRequestId, studentId, taskId, reason, studentName
});

// Emitted by server
socket.emit('video-chat-request', data);
socket.emit('video-chat-completed', { sessionId, duration });
```

---

## 💬 Team Chat Integration

### Components
- **File**: `client/src/components/TeamChat.jsx`
- **Database Model**: `backend/models/teamChat.js`

### Features
- ✅ Real-time team messaging
- ✅ Typing indicators
- ✅ Message history persistence
- ✅ User presence tracking
- ✅ Auto-scroll to latest messages
- ✅ Emoji reactions support (ready for implementation)
- ✅ Message pinning (ready for implementation)

### Usage
```jsx
import TeamChat from './components/TeamChat';

<TeamChat 
  teamId={teamId}
  taskId={taskId}
  userData={userData}
/>
```

### Backend Socket.io Handlers
```javascript
// Join team room
socket.on('join-team-room', (teamId) => {
  socket.join(`team-${teamId}`);
});

// Send team message
socket.on('team-message', async (data) => {
  // Saves to database and broadcasts to team
});

// Typing indicators
socket.on('team-user-typing', ({ teamId, userId, userName }) => {});
socket.on('team-user-stopped-typing', ({ teamId, userId }) => {});

// Leave room
socket.on('leave-team-room', (teamId) => {
  socket.leave(`team-${teamId}`);
});
```

### Backend API Endpoints
```
GET /team/:id/chat-history
  - Fetch team chat messages
  - Returns last 50 messages sorted by date
```

---

## 🔔 Notifications System

### Components
- **File**: `client/src/components/StudentDashboard.jsx` (updated)
- **Database Model**: `backend/models/notification.js`

### Features
- ✅ Multiple notification types (task_assignment, submission_reviewed, team_invite, task_update)
- ✅ Read/unread status tracking
- ✅ Linked to related entities (tasks, teams, users)
- ✅ Real-time notification delivery
- ✅ Relative time display (e.g., "2 hours ago")

### Notification Types
```javascript
{
  task_assignment: 'New task assigned to team',
  submission_reviewed: 'Your submission has been reviewed',
  team_invite: 'You\'ve been invited to a team',
  task_update: 'A task you applied for has been updated'
}
```

### Database Schema
```javascript
{
  userId: ObjectId,
  type: String (enum),
  title: String,
  message: String,
  relatedTaskId: ObjectId,
  relatedTeamId: ObjectId,
  relatedUserId: ObjectId,
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Backend API Endpoints
```
GET /notifications
  - Fetch user notifications (last 20, sorted by date)
  
POST /notifications/:id/read
  - Mark notification as read
```

### Creating Notifications (Backend Example)
```javascript
const notification = await notificationModel.create({
  userId: studentId,
  type: 'task_assignment',
  title: 'New Task Available',
  message: `You've been assigned to task: ${taskTitle}`,
  relatedTaskId: taskId,
  isRead: false
});
```

---

## 🏆 Badges System

### Components
- **File**: `client/src/components/StudentProfile.jsx` (updated)
- **Database Model**: `backend/models/badge.js`

### Features
- ✅ Achievement badge system
- ✅ Badge criteria based on user actions
- ✅ Icon and description for each badge
- ✅ Enable/disable badges dynamically

### Badge Criteria Types
```javascript
{
  tasks_completed: 'Number of tasks completed',
  submissions_reviewed: 'Number of submissions reviewed',
  quality_score: 'Average quality score',
  team_contribution: 'Team member contributions',
  quick_completion: 'Tasks completed within deadline'
}
```

### Database Schema
```javascript
{
  name: String,
  description: String,
  icon: String (emoji),
  criteria: {
    type: String,
    threshold: Number
  },
  isActive: Boolean,
  createdAt: Date
}
```

### Backend API Endpoints
```
GET /badges
  - Fetch user's earned badges
  - Populates badges from user's badge array
```

### Assigning Badges (Backend Example)
```javascript
// When user completes a task
const badge = await badgeModel.findOne({ name: 'First Task Completed' });
await userModel.findByIdAndUpdate(userId, {
  $addToSet: { badges: badge._id }
});
```

---

## 👥 Enhanced Mentor Dashboard

### Components
- **File**: `client/src/components/MentorDashboardEnhanced.jsx`

### Features
- ✅ View all mentor's created tasks
- ✅ View team applications for each task
- ✅ Display team information (members, leader, application date)
- ✅ Approve/reject applications (UI ready, API implementation needed)
- ✅ Send messages to approved teams
- ✅ Real-time application count display

### UI Sections
1. **Tasks List** (Left sidebar)
   - Shows all mentor's tasks
   - Displays application count badge
   - Click to view applications

2. **Application Details** (Main area)
   - Team name and metadata
   - Member list with details
   - Application message
   - Status badge (pending, approved, rejected)
   - Action buttons based on status

### Backend API Endpoints
```
GET /mentor/task/:id/applications
  - Fetch all applications for a task
  - Returns detailed team and member information
  - Validates task ownership by mentor
  - Response includes:
    {
      _id: Application ID,
      teamId: Team ObjectId,
      teamName: String,
      memberCount: Number,
      leader: ObjectId,
      members: [User objects],
      status: String (pending, approved, rejected),
      appliedAt: Date,
      message: String
    }
```

### Next Steps for Full Implementation
1. Create approve/reject application endpoints
2. Update task status based on application decisions
3. Notify teams of application decisions via notifications
4. Integrate messaging system between mentor and team

---

## 🔄 API Integration Summary

### New API Functions (in `client/src/utils/api.js`)

```javascript
// Notifications
export const getNotifications = async () 
export const markNotificationRead = async (notificationId)

// Badges
export const getBadges = async ()

// Team Chat
export const getTeamChatHistory = async (teamId)

// Video Chat
export const completeVideoChat = async (sessionId, data)
export const getVideoChatHistory = async (taskId)
```

### Backend Imports (in `server.js`)
```javascript
const notificationModel = require('./models/notification');
const badgeModel = require('./models/badge');
const teamChatModel = require('./models/teamChat');
```

---

## 🚀 Setup Checklist

- [x] Create database models (notification, badge, teamChat)
- [x] Build VideoCall component with WebRTC
- [x] Build TeamChat component with Socket.io
- [x] Update StudentDashboard to use API notifications
- [x] Update StudentProfile to use API badges
- [x] Add Socket.io handlers for team chat
- [x] Add API endpoints for notifications, badges, team chat
- [x] Create MentorDashboardEnhanced component
- [x] Add application viewing endpoint to backend
- [ ] **TODO**: Implement application approval/rejection logic
- [ ] **TODO**: Create notification triggers for key events
- [ ] **TODO**: Implement badge earning logic
- [ ] **TODO**: Add message system between mentor and teams
- [ ] **TODO**: Implement emoji reactions and message pinning
- [ ] **TODO**: Add file attachment support to team chat

---

## 🐛 Troubleshooting

### VideoCall Issues
- **No video displayed**: Check browser permissions for camera/microphone
- **Audio issues**: Verify audio constraints in `getUserMedia()` call
- **Connection problems**: Ensure STUN servers are reachable, check firewall

### Team Chat Issues
- **Messages not appearing**: Verify Socket.io connection and room joining
- **Typing indicators stuck**: Check timer cleanup in useEffect
- **Chat history not loading**: Ensure teamId is valid and user is in team

### Notification Issues
- **Notifications not showing**: Verify API call is successful, check network tab
- **Old data cached**: Clear browser cache, ensure fresh API calls on mount
- **Timestamp issues**: Verify server and client clocks are synchronized

### Badge Issues
- **Badges not visible**: Confirm badges are added to user model in database
- **Wrong badge data**: Check badge schema matches API response format

---

## 📚 Related Documentation

- [QUICK_START.md](./QUICK_START.md) - Getting started guide
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Detailed implementation
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Complete API reference

---

## 💡 Best Practices

1. **WebRTC**: Always clean up peer connections and tracks on component unmount
2. **Socket.io**: Join and leave rooms properly to avoid memory leaks
3. **Notifications**: Mark as read when user views them
4. **Badges**: Check badge criteria before assigning
5. **Team Chat**: Implement rate limiting to prevent spam
6. **API Calls**: Always wrap in try-catch for error handling

---

## 🔐 Security Considerations

- ✅ All endpoints require `isLoggedIn` middleware
- ✅ Mentor-specific endpoints verify role
- ✅ Task ownership verified before accessing applications
- ✅ Socket.io events validated for required fields
- ✅ CORS configured for frontend URL only

---

## 📞 Support

For issues or questions about these features:
1. Check the troubleshooting section above
2. Review error messages in browser console
3. Check Network tab for API responses
4. Verify database connectivity
5. Ensure all models are properly imported

---

**Last Updated**: Current Session  
**Version**: 2.0 with Advanced Features
