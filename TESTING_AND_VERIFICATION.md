# MentorConnect - Testing Guide for Bug Fixes

## Quick Start - Testing All Fixes

### Test 1: Team Chat Access ✅
**Objective:** Verify students can access team chat from task details

**Steps:**
1. Login as student
2. Go to "Active Tasks" or "Browse Tasks"
3. Click on a task
4. Look for "Team Chat" tab (between "Task Chat" and "Video Call")
5. Click "Team Chat" tab
6. Verify you see team member list and chat interface

**Expected Result:** Team chat interface displays with messaging capability

---

### Test 2: Video Call UI ✅
**Objective:** Verify video call interface is accessible and clear

**Steps:**
1. Login as student
2. Open any task from active tasks or browse
3. Look for "Video Call" tab (last tab)
4. Click "Video Call" tab
5. Verify you see:
   - "How Video Calls Work" info section
   - "Request Video Chat with Mentor" button
   - Mentor information (name, email)

**Expected Result:** Video call interface is clear and inviting

---

### Test 3: Video Call Notification ✅
**Objective:** Verify mentor receives notification when student requests video call

**Steps:**
1. Login as student
2. Open task details
3. Click "Video Call" tab
4. Click "Request Video Chat with Mentor" button
5. Enter reason: "Need help with implementation"
6. Click "Request Video Chat"
7. Close student window, login as that task's mentor
8. Check notifications (or look in "Pending Reviews" section)

**Expected Result:** 
- Student sees success message
- Mentor receives real-time Socket.io notification
- Notification appears in mentor's notifications
- Notification includes student name and task title

---

### Test 4: GitHub Requirement - Task Application ✅
**Objective:** Verify GitHub URL is required when applying for task

**Steps:**
1. Login as student
2. Go to "Browse Tasks"
3. Find a task and click "Apply"
4. Modal dialog should appear asking for "GitHub Repository URL"
5. Try clicking "Apply" without entering URL
6. Verify error: "Please provide your GitHub repository URL"
7. Enter invalid URL like "github.com/repo" (no http)
8. Verify error: "Please provide a valid GitHub repository URL"
9. Enter valid URL: "https://github.com/username/repo"
10. Click "Apply"

**Expected Result:**
- Modal prevents applying without GitHub URL
- GitHub URL is validated
- Application succeeds with valid URL
- Mentor can see GitHub URL in in-progress work

**Check Backend:**
```bash
# In MentorDashboard, check "In Progress Work" section
# Student should appear with GitHub repo link displayed
```

---

### Test 5: GitHub Requirement - Task Completion ✅
**Objective:** Verify GitHub URL is required when submitting completed work

**Steps:**
1. Login as student
2. Open a task from "Active Tasks"
3. Click "Overview" tab
4. Click "Report Completion" button
5. Form appears with "GitHub Repository URL" field marked as *Required
6. Try to submit without GitHub URL
7. Verify error on frontend
8. Enter valid GitHub URL
9. Add completion notes
10. Click "Submit Completion Report"

**Expected Result:**
- GitHub URL field is required (asterisk shown)
- Form prevents submission without URL
- Success message shows after submission
- Mentor receives notification and can see GitHub link

---

### Test 6: Mentor Progress Tracking ✅
**Objective:** Verify mentors can track student progress in real-time

**Steps:**
1. Login as mentor
2. Go to "Mentor Dashboard"
3. Look at top stats - should see new "In Progress" card
4. Scroll down to "In Progress Work" section
5. Should see students currently working on tasks
6. For each entry, verify:
   - Team/Student name
   - Task title
   - GitHub repository link (clickable)
   - Progress notes
   - "View Details" button
   - Started date
7. Click on GitHub link - should open in new tab

**Expected Result:**
- In Progress section shows all active submissions
- GitHub links are functional
- Progress tracking is real-time
- Mentor can access repository without leaving app

---

### Test 7: Mentor Submission Review ✅
**Objective:** Verify mentors can see GitHub links in pending reviews

**Steps:**
1. Login as mentor
2. Go to "Mentor Dashboard"
3. Look at "Pending Reviews" section
4. Each pending review should show:
   - Task name
   - Student name
   - GitHub repository link (in gray box)
   - Submission date
   - "Review" button
5. Click on GitHub link - should open repository
6. Click "Review" button - should go to evaluation page

**Expected Result:**
- GitHub links are displayed for all submissions
- Links are clickable and functional
- Review button navigates to evaluation page

---

## Database/Backend Checks

### Check Submission Status Flow
```javascript
// In MongoDB, submissions should follow this status path:
"in-progress" (set when student applies with GitHub URL)
  ↓
"submitted" (set when student completes task)
  ↓
"reviewed" (set when mentor evaluates)
```

### Check Notifications Created
```javascript
// In MongoDB notifications collection:
// Should see entries with type "video_request" and "task_completion"
db.notifications.find({
  type: { $in: ["video_request", "task_completion"] }
})
```

### Check GitHub URLs Stored
```javascript
// All submissions from in-progress forward should have githubUrl
db.submissions.find({
  status: { $in: ["in-progress", "submitted", "reviewed"] },
  githubUrl: { $exists: true, $ne: "" }
})
```

---

## Success Criteria

All 5 issues should be resolved:

- [ ] Students can access Team Chat from task details
- [ ] Students can see and use Video Call interface
- [ ] Mentors receive real-time notifications for video requests
- [ ] Mentors can track student progress in real-time
- [ ] GitHub URLs are required and validated

---

## Support

For issues:
1. Check browser console for errors
2. Check server logs for backend errors
3. Verify Socket.io configuration
4. Review FIXES_IMPLEMENTED.md for details
