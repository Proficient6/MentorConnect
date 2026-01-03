# MentorConnect - Complete Integration Overview

## 🎯 Project Overview
MentorConnect is a modern web platform for mentors and students to collaborate on real-world tasks with real-time features including video calls, team chat, notifications, and achievement badges.

---

## 📦 Technology Stack

### Frontend
- **Framework**: React with Hooks
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Real-time**: Socket.io Client
- **WebRTC**: Native RTCPeerConnection
- **State Management**: React Hooks (useState, useEffect, useRef)
- **HTTP Client**: Fetch API

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password**: Bcrypt
- **Real-time**: Socket.io
- **CORS**: Enabled for frontend domain

### Database
- **Main Database**: MongoDB
- **Collections**: Users, Tasks, Teams, Submissions, Chat, VideoChat, Notifications, Badges, TeamChat

---

## 🏗️ Project Structure

```
MentorConnect/
├── backend/
│   ├── models/
│   │   ├── user.js
│   │   ├── task.js
│   │   ├── team.js
│   │   ├── submission.js
│   │   ├── chat.js              (task chat)
│   │   ├── videoChat.js         (NEW)
│   │   ├── notification.js      (NEW)
│   │   ├── badge.js             (NEW)
│   │   └── teamChat.js          (NEW)
│   ├── server.js                (Express server with Socket.io)
│   ├── db.js                    (MongoDB connection)
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentDashboard.jsx     (MODIFIED)
│   │   │   ├── StudentProfile.jsx       (MODIFIED)
│   │   │   ├── VideoCall.jsx            (NEW)
│   │   │   ├── TeamChat.jsx             (NEW)
│   │   │   ├── MentorDashboardEnhanced.jsx (NEW)
│   │   │   └── ... (other components)
│   │   ├── utils/
│   │   │   └── api.js                   (MODIFIED)
│   │   └── App.jsx
│   └── package.json
│
├── ADVANCED_FEATURES.md          (NEW)
├── SESSION_2_SUMMARY.md          (NEW)
├── TESTING_GUIDE.md              (NEW)
└── README.md
```

---

## 🔌 API Endpoints Summary

### Authentication
- `POST /signup` - Register new user
- `POST /login` - Login user
- `GET /logout` - Logout user
- `GET /verify-token` - Verify JWT token

### Student APIs
- `GET /student/profile` - Get student profile
- `POST /student/profile/update` - Update student profile
- `GET /student/dashboard` - Get dashboard data

### Task APIs
- `GET /tasks` - Get all available tasks
- `GET /tasks/:id` - Get task details
- `POST /tasks/:id/apply` - Apply to task
- `POST /tasks/:id/submit` - Submit task
- `GET /tasks/:id/chat-history` - Get task chat messages
- `POST /tasks/:id/request-video-chat` - Request video chat with mentor
- `POST /tasks/:id/complete` - Mark task as complete

### Team APIs
- `POST /team/create` - Create new team
- `POST /team/join` - Join existing team
- `GET /team/:id` - Get team details
- `GET /team/my-team` - Get user's team
- `POST /team/:id/leave` - Leave team
- `GET /team/:id/chat-history` - Get team chat history

### Mentor APIs
- `GET /mentor/profile` - Get mentor profile
- `POST /mentor/profile/update` - Update mentor profile
- `POST /mentor/task/create` - Create new task
- `GET /mentor/tasks` - Get all mentor's tasks
- `GET /mentor/submissions` - Get all submissions for mentor's tasks
- `POST /mentor/evaluate/:submissionId` - Evaluate submission
- `GET /mentor/task/:id/applications` - Get team applications for task

### Notifications & Badges
- `GET /notifications` - Get user notifications
- `POST /notifications/:id/read` - Mark notification as read
- `GET /badges` - Get user's earned badges

### Video Chat
- `POST /video-chat/:sessionId/complete` - Complete video chat session

---

## 🔌 Socket.io Events

### Task Chat
| Event | Direction | Purpose |
|-------|-----------|---------|
| `join-task-room` | Client → Server | Join task chat room |
| `task-message` | Client → Server | Send task message |
| `new-task-message` | Server → Client | Receive new task message |
| `typing` | Client → Server | Notify typing |
| `show-typing` | Server → Client | Show user typing |

### Team Chat
| Event | Direction | Purpose |
|-------|-----------|---------|
| `join-team-room` | Client → Server | Join team chat room |
| `team-message` | Client → Server | Send team message |
| `new-team-message` | Server → Client | Receive new team message |
| `team-user-typing` | Client → Server | Notify typing |
| `team-user-typing` | Server → Client | Show user typing |
| `team-user-stopped-typing` | Client → Server | Stop typing indicator |
| `team-user-stopped-typing` | Server → Client | Remove typing indicator |
| `leave-team-room` | Client → Server | Leave team chat room |

### Video Chat
| Event | Direction | Purpose |
|-------|-----------|---------|
| `video-chat-request` | Server → Client | Mentor receives request |
| `video-chat-completed` | Server → Client | Notify call completion |

### User Status
| Event | Direction | Purpose |
|-------|-----------|---------|
| `user-online` | Client → Server | User came online |
| `online-users-count` | Server → Client | Broadcast online count |
| `disconnect` | System | User disconnected |

---

## 🗄️ Database Schema Summary

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (student/mentor),
  bio: String,
  skills: [String],
  education: String,
  githubUrl: String,
  linkedinUrl: String,
  badges: [ObjectId],      // References to Badge IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  requirements: [String],
  applications: [{
    teamId: ObjectId,
    status: String (pending/approved/rejected),
    message: String,
    appliedAt: Date
  }],
  mentorId: ObjectId,
  status: String (active/completed/closed),
  startDate: Date,
  endDate: Date,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Teams Collection
```javascript
{
  _id: ObjectId,
  name: String,
  code: String (unique),
  leader: ObjectId,
  members: [ObjectId],
  joinedTasks: [ObjectId],
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Submissions Collection
```javascript
{
  _id: ObjectId,
  taskId: ObjectId,
  teamId: ObjectId,
  studentId: ObjectId,
  status: String (draft/submitted/reviewed),
  notes: String,
  githubUrl: String,
  scores: Object,
  feedback: String,
  totalScore: Number,
  submittedAt: Date,
  reviewedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Collection (Task Chat)
```javascript
{
  _id: ObjectId,
  taskId: ObjectId,
  senderId: ObjectId,
  message: String,
  senderName: String,
  senderRole: String (student/mentor),
  createdAt: Date,
  updatedAt: Date
}
```

### VideoChat Collection
```javascript
{
  _id: ObjectId,
  taskId: ObjectId,
  studentId: ObjectId,
  mentorId: ObjectId,
  reason: String,
  sessionId: String (unique),
  status: String (pending/active/completed),
  duration: Number (seconds),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection (NEW)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String (task_assignment/submission_reviewed/team_invite/task_update),
  title: String,
  message: String,
  relatedTaskId: ObjectId (optional),
  relatedTeamId: ObjectId (optional),
  relatedUserId: ObjectId (optional),
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Badge Collection (NEW)
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  icon: String (emoji),
  criteria: {
    type: String (tasks_completed/submissions_reviewed/quality_score/team_contribution/quick_completion),
    threshold: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### TeamChat Collection (NEW)
```javascript
{
  _id: ObjectId,
  teamId: ObjectId,
  taskId: ObjectId (optional),
  senderId: ObjectId,
  message: String,
  senderName: String,
  senderRole: String (student/mentor),
  messageType: String (text/file/announcement),
  reactions: [{
    emoji: String,
    userIds: [ObjectId]
  }],
  isPinned: Boolean,
  pinnedAt: Date (if pinned),
  attachments: [String] (URLs),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Flow

```
User Signup
  ↓
Email validation (domain check)
  ↓
Password hashing (bcrypt)
  ↓
User stored in database
  ↓
JWT token generated
  ↓
Token stored in cookie
  ↓
Redirect to dashboard

---

User Login
  ↓
Email & password validation
  ↓
Password verification
  ↓
JWT token generated
  ↓
Token stored in cookie
  ↓
Redirect to dashboard

---

Protected Route Request
  ↓
Extract JWT from cookie
  ↓
Verify JWT signature
  ↓
Extract user data from token
  ↓
Attach user to request object
  ↓
Allow/deny based on role
  ↓
Proceed with request
```

---

## 🎬 WebRTC Flow

```
Student requests video chat
  ↓
Backend generates session ID
  ↓
Mentor notified via Socket.io
  ↓
Mentor accepts call
  ↓
Both open VideoCall component
  ↓
Frontend initializes WebRTC
  ↓
getUserMedia() captures video/audio
  ↓
RTCPeerConnection created
  ↓
STUN servers used for NAT traversal
  ↓
ICE candidates exchanged
  ↓
Peer connection established
  ↓
Local and remote video streams display
  ↓
Users can toggle mic/video/screen share
  ↓
End call button closes connection
  ↓
Duration saved to database
  ↓
Both parties notified
```

---

## 💬 Real-time Chat Flow

### Task Chat
```
User types message
  ↓
Socket.io emit 'task-message'
  ↓
Backend receives message
  ↓
Message saved to Chat collection
  ↓
Broadcast to all users in room (task-{taskId})
  ↓
Frontend receives 'new-task-message'
  ↓
Message added to local state
  ↓
UI updates with new message
  ↓
Auto-scroll to bottom
```

### Team Chat
```
User types message in team
  ↓
Socket.io emit 'team-message'
  ↓
Backend receives message
  ↓
Message saved to TeamChat collection
  ↓
Broadcast to all users in room (team-{teamId})
  ↓
Frontend receives 'new-team-message'
  ↓
Message added to local state
  ↓
UI updates with new message
  ↓
Auto-scroll to bottom
```

---

## 🔔 Notification Flow

```
Event occurs (e.g., task assigned)
  ↓
Backend creates notification record
  ↓
Notification saved to database
  ↓
Socket.io emits notification event (optional)
  ↓
Student opens dashboard
  ↓
Frontend calls GET /notifications
  ↓
API returns user's notifications (last 20)
  ↓
UI displays with type badge and relative time
  ↓
User can mark as read
  ↓
Frontend calls POST /notifications/:id/read
  ↓
Backend updates isRead: true
  ↓
Notification marked as read in UI
```

---

## 🏆 Badge System Flow

```
User completes task/action
  ↓
Backend checks badge criteria
  ↓
Matches found
  ↓
Badge added to user.badges array
  ↓
Notification created for user
  ↓
User opens profile
  ↓
Frontend calls GET /badges
  ↓
API returns user's earned badges
  ↓
UI displays badges with icon and description
  ↓
Badge information persists
```

---

## 📊 Data Persistence Strategy

### Real-time Data (Socket.io)
- All messages saved immediately
- Typing indicators not persisted
- Session data not persisted
- Call events logged but not persisted

### User Data
- All user information persisted
- Profile changes immediately saved
- Badges persisted to user document
- Skills and education tracked

### Task Data
- Task details persisted
- Applications stored in array
- Submissions stored separately
- Chat history maintained

### Team Data
- Team information persisted
- Member list stored
- Chat history maintained
- Join/leave events logged

---

## 🔄 State Management Pattern

### Frontend (React Hooks)

```javascript
// Local Component State
const [state, setState] = useState(initialValue);

// Effect for side effects
useEffect(() => {
  // Fetch data or set up listeners
  return () => {
    // Cleanup (unsubscribe, abort, etc.)
  };
}, [dependencies]);

// Ref for DOM access or persistent values
const ref = useRef(null);
```

### Socket.io State

```javascript
// Client-side
socket.on('event-name', (data) => {
  setState(data);
});

socket.emit('event-name', data);

// Server-side
socket.on('event-name', (data) => {
  io.to('room-name').emit('response-event', processedData);
});
```

---

## 🎨 Component Hierarchy

```
App.jsx
├── Navbar.jsx
├── Login.jsx / Signup.jsx
├── StudentDashboard.jsx
│   ├── Stats display
│   ├── Active tasks list
│   └── Notifications (fetched from API)
├── StudentProfile.jsx
│   ├── Profile form
│   ├── Skills management
│   └── Badges (fetched from API)
├── BrowseTasks.jsx
│   └── Task cards
├── TaskDetail.jsx
│   ├── Task information
│   ├── TaskChat.jsx (Socket.io)
│   ├── VideoCall.jsx (WebRTC)
│   └── TaskSubmission.jsx
├── TeamManagement.jsx
│   ├── Team list
│   └── TeamChat.jsx (Socket.io)
├── MentorDashboard.jsx (or MentorDashboardEnhanced.jsx)
│   ├── Task list
│   ├── Submissions view
│   └── Applications view (enhanced)
├── MentorTaskCreate.jsx
├── MentorEvaluation.jsx
├── MentorProfile.jsx
└── TaskChat.jsx (reusable)
```

---

## 📈 Performance Considerations

### Database
- Indexes on frequently queried fields (userId, taskId, teamId)
- Compound indexes for multi-field queries
- Pagination ready (not yet implemented)

### Frontend
- Component memoization available
- Lazy loading available
- Socket.io room isolation
- Proper cleanup in useEffect

### Backend
- Connection pooling for database
- Socket.io namespaces available
- Caching opportunities
- Rate limiting ready

---

## 🔐 Security Features

- JWT authentication
- Bcrypt password hashing
- CORS configuration
- Role-based access control
- Input validation
- XSS prevention
- CSRF token ready
- Rate limiting ready

---

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Flexible layouts
- Touch-friendly buttons
- Mobile-optimized components

---

## 🚀 Deployment Checklist

- [ ] Set environment variables
- [ ] Configure MongoDB Atlas connection
- [ ] Set JWT_SECRET to strong value
- [ ] Configure FRONTEND_URL for CORS
- [ ] Enable HTTPS
- [ ] Set NODE_ENV to production
- [ ] Configure database backups
- [ ] Set up monitoring
- [ ] Configure error logging
- [ ] Set up CI/CD pipeline

---

## 📚 Related Files

- [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) - Feature documentation
- [SESSION_2_SUMMARY.md](./SESSION_2_SUMMARY.md) - Implementation summary
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing and verification
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Detailed implementation

---

## 🎓 Learning Path

1. Start with [QUICK_START.md](./QUICK_START.md)
2. Read [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md)
3. Follow [TESTING_GUIDE.md](./TESTING_GUIDE.md)
4. Review [SESSION_2_SUMMARY.md](./SESSION_2_SUMMARY.md)
5. Implement pending features from [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## 🎉 Summary

MentorConnect is now equipped with:
- ✅ Real-time video calling (WebRTC)
- ✅ Team chat with message persistence (Socket.io)
- ✅ Dynamic notifications system
- ✅ Achievement badges
- ✅ Enhanced mentor dashboard
- ✅ Complete API integration
- ✅ Database models for all features
- ✅ Comprehensive documentation

**Ready for testing and deployment!**

---

**Last Updated**: Current Session  
**Version**: 2.0 - Advanced Features  
**Status**: Feature Complete ✅
