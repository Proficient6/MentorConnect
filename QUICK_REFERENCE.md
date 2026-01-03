# MentorConnect - Quick Reference Card

## 🎯 Core Features

### WebRTC Video Calls
- **Component**: `VideoCall.jsx`
- **Usage**: Mentor-student real-time video calling
- **Key Props**: `sessionId`, `userData`, `mentorData`, `onClose`
- **Database**: `videoChat.js` collection
- **API**: `/tasks/:id/request-video-chat`, `/video-chat/:sessionId/complete`

### Team Chat
- **Component**: `TeamChat.jsx`
- **Usage**: Real-time team messaging
- **Key Props**: `teamId`, `taskId`, `userData`
- **Database**: `teamChat.js` collection
- **API**: `/team/:id/chat-history`
- **Socket Events**: `join-team-room`, `team-message`, `team-user-typing`

### Notifications
- **Component**: Updates in `StudentDashboard.jsx`
- **Usage**: Display user notifications
- **Database**: `notification.js` collection
- **API**: `GET /notifications`, `POST /notifications/:id/read`
- **Types**: task_assignment, submission_reviewed, team_invite, task_update

### Badges
- **Component**: Updates in `StudentProfile.jsx`
- **Usage**: Show user achievements
- **Database**: `badge.js` collection
- **API**: `GET /badges`
- **Criteria**: tasks_completed, submissions_reviewed, quality_score, team_contribution, quick_completion

### Mentor Dashboard
- **Component**: `MentorDashboardEnhanced.jsx`
- **Usage**: View team applications for tasks
- **Database**: Task and Team collections
- **API**: `GET /mentor/task/:id/applications`

---

## 📡 API Quick Reference

### Notifications
```javascript
// Get notifications
const notifications = await getNotifications();
// Response: { success: true, notifications: [...] }

// Mark as read
await markNotificationRead(notificationId);
```

### Badges
```javascript
// Get user badges
const badges = await getBadges();
// Response: { success: true, badges: [...] }
```

### Team Chat
```javascript
// Get chat history
const messages = await getTeamChatHistory(teamId);
// Response: { success: true, messages: [...] }
```

### Video Chat
```javascript
// Complete video call
await completeVideoChat(sessionId, { duration: 300 });
// Response: { success: true, message: '...', videoChat: {...} }
```

### Mentor Applications
```javascript
// Get task applications
const response = await fetch(
  `/mentor/task/${taskId}/applications`,
  { credentials: 'include' }
);
const data = await response.json();
// Response: { success: true, applications: [...] }
```

---

## 🔌 Socket.io Quick Reference

### Team Chat Events
```javascript
// Client emits
socket.emit('join-team-room', teamId);
socket.emit('team-message', {
  teamId, userId, userName, message, userRole
});
socket.emit('team-user-typing', { teamId, userId, userName });
socket.emit('team-user-stopped-typing', { teamId, userId });
socket.emit('leave-team-room', teamId);

// Client listens
socket.on('new-team-message', (messageData) => {});
socket.on('team-user-typing', ({ userId, userName }) => {});
socket.on('team-user-stopped-typing', ({ userId }) => {});
socket.on('team-user-joined', ({ teamId }) => {});
socket.on('team-user-left', ({ teamId }) => {});
```

### Task Chat Events
```javascript
// Client emits
socket.emit('join-task-room', taskId);
socket.emit('task-message', {
  taskId, userId, userName, message, userRole
});
socket.emit('typing', { taskId, userId });

// Client listens
socket.on('new-task-message', (messageData) => {});
socket.on('show-typing', ({ userId }) => {});
```

### Video Chat Events
```javascript
// Server emits
socket.emit('video-chat-request', {
  videoRequestId, studentId, taskId, reason, studentName
});
socket.emit('video-chat-completed', { sessionId, duration });
```

---

## 💾 Database Quick Reference

### Create Notification
```javascript
const notification = await notificationModel.create({
  userId: studentId,
  type: 'task_assignment',
  title: 'New Task Available',
  message: 'You\'ve been assigned to task: ...',
  relatedTaskId: taskId,
  isRead: false
});
```

### Create Badge
```javascript
const badge = await badgeModel.create({
  name: 'First Task Completed',
  description: 'Complete your first task',
  icon: '🎯',
  criteria: { type: 'tasks_completed', threshold: 1 },
  isActive: true
});
```

### Save Team Message
```javascript
const message = await teamChatModel.create({
  teamId,
  senderId: userId,
  message,
  senderName: userName,
  senderRole: userRole,
  messageType: 'text'
});
```

### Query Examples
```javascript
// Get user notifications (sorted by newest)
const notifications = await notificationModel
  .find({ userId })
  .sort({ createdAt: -1 })
  .limit(20);

// Get team chat (sorted by oldest)
const messages = await teamChatModel
  .find({ teamId })
  .sort({ createdAt: 1 })
  .limit(50);

// Get user badges
const badges = await badgeModel.find({
  _id: { $in: user.badges }
});
```

---

## 🎨 Component Usage Examples

### VideoCall Component
```jsx
import VideoCall from './components/VideoCall';

<VideoCall 
  sessionId="session_123456"
  userData={currentUser}
  mentorData={mentorInfo}
  onClose={() => setShowVideo(false)}
/>
```

### TeamChat Component
```jsx
import TeamChat from './components/TeamChat';

<TeamChat 
  teamId={team._id}
  taskId={task._id}
  userData={currentUser}
/>
```

### MentorDashboardEnhanced Component
```jsx
import MentorDashboardEnhanced from './components/MentorDashboardEnhanced';

<MentorDashboardEnhanced 
  setCurrentPage={setCurrentPage}
  userData={mentorUser}
/>
```

---

## 🚀 Quick Start Commands

```bash
# Start backend
cd backend
npm install
npm start

# Start frontend (in new terminal)
cd client
npm install
npm run dev

# Access application
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
```

---

## 🔍 Debugging Quick Tips

### Check WebRTC Connection
```javascript
console.log(peerConnectionRef.current?.connectionState);
console.log(peerConnectionRef.current?.iceConnectionState);
```

### Check Socket.io Status
```javascript
console.log(socket.connected);
console.log(socket.id);
```

### Check API Response
```javascript
const response = await fetch('/notifications');
console.log(await response.json());
```

### View Database
```bash
# MongoDB CLI
mongo
use mentorconnect
db.notifications.find()
db.teamchats.find()
db.badges.find()
```

---

## 📋 File Locations

| Feature | File | Type |
|---------|------|------|
| WebRTC Video Calls | `client/src/components/VideoCall.jsx` | Component |
| Team Chat | `client/src/components/TeamChat.jsx` | Component |
| Mentor Dashboard | `client/src/components/MentorDashboardEnhanced.jsx` | Component |
| Notifications | `client/src/components/StudentDashboard.jsx` | Updated |
| Badges | `client/src/components/StudentProfile.jsx` | Updated |
| API Functions | `client/src/utils/api.js` | Updated |
| Server Routes | `backend/server.js` | Updated |
| Notification Model | `backend/models/notification.js` | Model |
| Badge Model | `backend/models/badge.js` | Model |
| Team Chat Model | `backend/models/teamChat.js` | Model |
| Video Chat Model | `backend/models/videoChat.js` | Model |

---

## ✅ Implementation Checklist

### Completed
- [x] WebRTC video calling with screen share
- [x] Team chat with Socket.io
- [x] Notifications system with API
- [x] Badges system with API
- [x] Mentor dashboard with applications view
- [x] All database models
- [x] All API endpoints
- [x] Socket.io event handlers

### Pending
- [ ] Application approval/rejection endpoints
- [ ] Badge earning logic
- [ ] Notification trigger logic
- [ ] Message reactions UI
- [ ] Message pinning UI
- [ ] File attachments
- [ ] Direct mentor-team messaging

---

## 🎯 Next Steps

1. **Test All Features** - Follow [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. **Implement Pending** - See checklist above
3. **Deploy to Production** - Set environment variables
4. **Monitor Performance** - Set up logging and monitoring
5. **Gather User Feedback** - Iterate based on feedback

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| No video | Check camera permissions |
| Socket connection fails | Verify Socket.io on server |
| API 401 error | Check JWT token in cookie |
| Chat not loading | Verify teamId in database |
| Badges not showing | Ensure badges assigned to user |

---

## 📞 Support Resources

- **Documentation**: [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md)
- **Testing Guide**: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **Implementation**: [COMPLETE_INTEGRATION_MAP.md](./COMPLETE_INTEGRATION_MAP.md)
- **Summary**: [SESSION_2_SUMMARY.md](./SESSION_2_SUMMARY.md)

---

## 🎉 You're All Set!

All features are implemented and ready for testing. Start with:
1. Run the application locally
2. Follow the [TESTING_GUIDE.md](./TESTING_GUIDE.md)
3. Implement pending features
4. Deploy when ready

**Happy coding!** 🚀
