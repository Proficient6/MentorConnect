# MentorConnect - Testing & Next Steps Guide

## 🚀 Getting Started with New Features

### Prerequisites
- Node.js 14+ and npm installed
- MongoDB running locally or remote connection configured
- Frontend running on port 3001
- Backend running on port 3000

### Quick Start

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd client
   npm install
   ```

2. **Environment Setup**
   ```bash
   # backend/.env
   MONGODB_URI=mongodb://localhost:27017/mentorconnect
   JWT_SECRET=your-secret-key-change-in-production
   PORT=3000
   FRONTEND_URL=http://localhost:3001
   ```

3. **Start Services**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

---

## 🧪 Testing Checklist

### 1. WebRTC Video Calls Testing

#### Setup
- [ ] Create two test accounts (one mentor, one student)
- [ ] Create a task as mentor
- [ ] Student applies to task

#### Test Cases
- [ ] Student requests video chat from task detail page
- [ ] Mentor receives video chat request notification
- [ ] Mentor can start video call
- [ ] Local video displays correctly
- [ ] Both participants can see each other
- [ ] Mic toggle works (audio muted/unmuted)
- [ ] Video toggle works (video stopped/restarted)
- [ ] Screen sharing can be initiated
- [ ] Screen sharing displays in both windows
- [ ] Call statistics display (bitrate, latency)
- [ ] Call duration increases correctly
- [ ] End call button properly closes connection
- [ ] Call duration saved to database
- [ ] Both parties receive call completion notification

#### Debugging
```javascript
// Check WebRTC connection state
console.log(peerConnectionRef.current?.connectionState);
console.log(peerConnectionRef.current?.iceConnectionState);

// Check if tracks are flowing
localStreamRef.current?.getTracks().forEach(track => {
  console.log('Track:', track.kind, 'enabled:', track.enabled);
});
```

---

### 2. Team Chat Testing

#### Setup
- [ ] Create a team with multiple members
- [ ] Navigate to team chat from task detail or team management

#### Test Cases
- [ ] User joins team chat room successfully
- [ ] Previous messages load when entering chat
- [ ] Messages display in correct order
- [ ] New messages appear in real-time
- [ ] Typing indicator shows when user types
- [ ] Typing indicator disappears after 3 seconds
- [ ] Other team members see typing indicator
- [ ] User name displays with message
- [ ] Timestamp shows correct time
- [ ] Messages persist in database
- [ ] Auto-scroll to latest message works
- [ ] Chat works with multiple simultaneous users
- [ ] Leaving room cleans up Socket.io connection
- [ ] Reconnecting shows previous chat history

#### Database Verification
```javascript
// Check team messages in MongoDB
db.teamchats.find({ teamId: ObjectId("...") }).sort({ createdAt: -1 })
```

---

### 3. Notifications Testing

#### Setup
- [ ] Log in as a student
- [ ] View StudentDashboard
- [ ] Check notifications section

#### Test Cases
- [ ] Notifications load from API on component mount
- [ ] Different notification types show different colors
  - [ ] task_assignment (blue)
  - [ ] submission_reviewed (green)
  - [ ] team_invite (purple)
  - [ ] task_update (yellow)
- [ ] Relative time displays correctly (e.g., "2h ago")
- [ ] Notification message displays correctly
- [ ] Notifications appear in correct order (newest first)
- [ ] "No notifications" message shows when empty
- [ ] Notifications persist after page refresh

#### Manual Notification Creation (for testing)
```javascript
// In backend, create a test notification
db.notifications.insertOne({
  userId: ObjectId("student-id"),
  type: "task_assignment",
  title: "New Task",
  message: "You've been assigned to a new task",
  relatedTaskId: ObjectId("task-id"),
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

### 4. Badges Testing

#### Setup
- [ ] Log in as a student
- [ ] View student profile
- [ ] Check badges section

#### Test Cases
- [ ] Badges load from API on component mount
- [ ] Badge name displays correctly
- [ ] Badge description displays
- [ ] Badge icon (emoji) displays
- [ ] "No badges" message shows when empty
- [ ] Multiple badges display in list
- [ ] Badges persist after page refresh

#### Manual Badge Assignment (for testing)
```javascript
// Create a test badge
db.badges.insertOne({
  name: "First Task Completed",
  description: "Completed your first task",
  icon: "🎯",
  criteria: { type: "tasks_completed", threshold: 1 },
  isActive: true,
  createdAt: new Date()
})

// Assign to user
db.users.updateOne(
  { _id: ObjectId("user-id") },
  { $push: { badges: ObjectId("badge-id") } }
)
```

---

### 5. Mentor Dashboard Testing

#### Setup
- [ ] Log in as a mentor
- [ ] Create a task (or use existing)
- [ ] Have teams apply to the task

#### Test Cases
- [ ] All mentor's tasks display in left sidebar
- [ ] Application count shows correctly
- [ ] Clicking task shows application details
- [ ] Team name displays correctly
- [ ] Member count shows correctly
- [ ] "Applied on" date displays correctly
- [ ] Team members list shows all members
- [ ] Each member shows name and email
- [ ] Application message displays if present
- [ ] Status badge shows pending/approved/rejected
- [ ] Approve button visible for pending applications
- [ ] Reject button visible for pending applications
- [ ] "No applications" message shows when empty
- [ ] Clicking another task updates the view
- [ ] Application details load without errors

#### API Verification
```bash
# Test the API endpoint directly
curl -X GET http://localhost:3000/mentor/task/{taskId}/applications \
  -H "Cookie: token={jwt-token}" \
  -H "Content-Type: application/json"
```

---

## 🔧 Implementation Checklist (Pending Items)

### Application Approval/Rejection
- [ ] Create `/mentor/task/:taskId/applications/:appId/approve` endpoint
- [ ] Create `/mentor/task/:taskId/applications/:appId/reject` endpoint
- [ ] Update application status in database
- [ ] Send notification to team on approval/rejection
- [ ] Update task's accepted application reference
- [ ] Handle team assignment to approved application

### Badge Earning Logic
- [ ] Hook into task completion event
- [ ] Check badge criteria
- [ ] Award badge to user
- [ ] Send notification for new badge
- [ ] Implement for all badge types:
  - [ ] tasks_completed
  - [ ] submissions_reviewed
  - [ ] quality_score
  - [ ] team_contribution
  - [ ] quick_completion

### Notification Triggers
- [ ] Task assigned to team → create notification
- [ ] Submission reviewed by mentor → create notification
- [ ] Student added to team → create notification
- [ ] Task updated → create notification
- [ ] Video call request → Socket.io event

### Advanced Features
- [ ] Emoji reactions on team messages
- [ ] Message pinning in team chat
- [ ] File attachments in team chat
- [ ] Direct messaging between mentor and team
- [ ] Read receipts in team chat
- [ ] Voice messages in team chat

---

## 📊 Database Inspection Commands

### View Collections
```javascript
// MongoDB commands for testing

// View recent notifications
db.notifications.find().sort({ createdAt: -1 }).limit(5)

// View all badges
db.badges.find()

// View team chat messages
db.teamchats.find({ teamId: ObjectId("...") }).sort({ createdAt: -1 }).limit(10)

// View video chat sessions
db.videochats.find().sort({ createdAt: -1 })

// Check user's earned badges
db.users.findOne({ _id: ObjectId("...") }, { badges: 1 })
```

---

## 🐛 Common Issues & Solutions

### WebRTC Issues
| Issue | Solution |
|-------|----------|
| No video stream | Check camera permissions, verify constraints in code |
| Audio feedback | Enable echoCancellation in audio constraints |
| Connection fails | Verify STUN servers accessible, check firewall |
| Screen share not working | Ensure https or localhost for getDisplayMedia |
| Poor video quality | Reduce resolution constraints, check bandwidth |

### Socket.io Issues
| Issue | Solution |
|-------|----------|
| Messages not appearing | Check room joining, verify Socket.io connection |
| Typing stuck | Verify timer cleanup, check browser console for errors |
| Connection drops | Check server, verify CORS settings |
| Memory leak | Ensure proper cleanup in useEffect |

### API Issues
| Issue | Solution |
|-------|----------|
| 404 errors | Verify endpoint exists, check URL spelling |
| 401 errors | Verify JWT token, check cookie settings |
| CORS errors | Verify CORS config in server, check frontend URL |
| Data not saving | Check database connection, verify schema validation |

---

## 🚀 Performance Optimization

### Frontend
- [ ] Implement pagination for notifications (load 20 at a time)
- [ ] Implement virtual scrolling for large chat histories
- [ ] Memoize components to prevent unnecessary re-renders
- [ ] Lazy load heavy components (VideoCall)

### Backend
- [ ] Add caching for frequently accessed data
- [ ] Implement rate limiting on Socket.io events
- [ ] Add request throttling for API endpoints
- [ ] Optimize database queries with proper indexes

---

## 📱 Responsive Design Testing

Test all new features on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

#### Specific Tests
- [ ] VideoCall video elements responsive
- [ ] TeamChat message list scrolls properly on mobile
- [ ] MentorDashboard sidebar collapses on mobile
- [ ] StudentDashboard notifications stack vertically
- [ ] StudentProfile badges responsive

---

## 🔒 Security Testing

- [ ] Verify authentication required for all protected endpoints
- [ ] Test role-based access (mentor vs student)
- [ ] Test task ownership verification
- [ ] Test XSS prevention on message display
- [ ] Test SQL injection prevention
- [ ] Verify CORS headers correct
- [ ] Test rate limiting (if implemented)

---

## 📈 Load Testing Recommendations

### Socket.io Load Test
```javascript
// Test multiple simultaneous connections
const io = require('socket.io-client');

for (let i = 0; i < 100; i++) {
  const socket = io('http://localhost:3000');
  socket.emit('join-team-room', 'teamId');
}
```

### API Load Test
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3000/notifications

# Using wrk
wrk -t4 -c100 -d30s http://localhost:3000/notifications
```

---

## 📚 Additional Documentation

For detailed information about each feature:
- [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) - Complete feature documentation
- [SESSION_2_SUMMARY.md](./SESSION_2_SUMMARY.md) - Implementation summary
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API reference (if available)
- [QUICK_START.md](./QUICK_START.md) - Quick start guide

---

## 🎓 Learning Resources

### WebRTC
- [MDN WebRTC Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebRTC Best Practices](https://www.html5rocks.com/en/tutorials/webrtc/basics/)

### Socket.io
- [Socket.io Documentation](https://socket.io/docs/)
- [Real-time Chat Tutorial](https://socket.io/get-started/chat)

### MongoDB
- [MongoDB Query Language](https://docs.mongodb.com/manual/reference/)
- [MongoDB Indexing](https://docs.mongodb.com/manual/indexes/)

---

## 💬 Getting Help

If you encounter issues:

1. **Check Console**
   - Browser DevTools Console for frontend errors
   - Terminal/logs for backend errors

2. **Check Network Tab**
   - Verify API calls are successful
   - Check response payloads match expected format

3. **Check Database**
   - Use MongoDB Compass or command line
   - Verify data is being saved correctly

4. **Check Socket.io**
   - Use Socket.io DevTools extension
   - Verify events are being emitted/received

5. **Recreate Issue**
   - Follow exact steps to reproduce
   - Note browser version and OS
   - Share error messages and logs

---

## ✅ Sign-Off Checklist

- [ ] All features tested and working
- [ ] No console errors or warnings
- [ ] Database contains expected data
- [ ] API endpoints responding correctly
- [ ] Socket.io events firing properly
- [ ] Responsive design working
- [ ] Security checks passed
- [ ] Performance acceptable
- [ ] Documentation complete

---

**Ready for testing!** 🎉

Start with the WebRTC Video Calls testing, then move through each feature systematically. Refer to the troubleshooting guide if you encounter any issues.
