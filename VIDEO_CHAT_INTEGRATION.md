# Video Chat Integration Guide

This guide helps you integrate a real video chat service into MentorConnect.

## Overview

The current implementation:
- ✅ Generates unique session IDs for video requests
- ✅ Stores video request metadata in database
- ✅ Sends notifications to mentors
- ⏳ Needs integration with actual video service

## Recommended Services

### Option 1: Agora (Recommended)
- **Pros**: Easy setup, high quality, reasonable pricing
- **Cons**: Requires API key
- **Cost**: Free tier available (10,000 minutes/month)
- **Setup Time**: 15-30 minutes

### Option 2: Twilio
- **Pros**: Reliable, excellent documentation
- **Cons**: Higher cost
- **Cost**: Pay-as-you-go
- **Setup Time**: 30-45 minutes

### Option 3: Daily.co
- **Pros**: Simple, good UX
- **Cons**: Higher pricing
- **Cost**: $30+/month
- **Setup Time**: 20-30 minutes

---

## Integration with Agora (Recommended)

### Step 1: Sign Up & Get Credentials

1. Go to [Agora.io](https://www.agora.io)
2. Create free account
3. Go to Console → Projects
4. Create new project
5. Get your **App ID** and generate **App Certificate**

### Step 2: Backend Setup

Install Agora SDK:
```bash
cd backend
npm install agora-token agora-access-token
```

Add to `.env`:
```
AGORA_APP_ID=your_app_id_here
AGORA_APP_CERTIFICATE=your_app_certificate_here
```

Create `backend/utils/agoraToken.js`:
```javascript
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const generateAgoraToken = (channelName, uid, role = 'publisher') => {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const expirationTimeInSeconds = 3600; // 1 hour
  
  const uidInt = parseInt(uid);
  
  if (role === 'subscriber') {
    return RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uidInt,
      RtcRole.SUBSCRIBER,
      expirationTimeInSeconds
    );
  } else {
    return RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uidInt,
      RtcRole.PUBLISHER,
      expirationTimeInSeconds
    );
  }
};

module.exports = { generateAgoraToken };
```

### Step 3: Add Token Generation Endpoint

In `backend/server.js`:
```javascript
const { generateAgoraToken } = require('./utils/agoraToken');

// Generate Agora token for video chat
app.get('/video-chat/:sessionId/token', isLoggedIn, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { role = 'publisher' } = req.query;
    
    // Find video chat request
    const videoChat = await videoChatModel.findOne({ sessionId });
    
    if (!videoChat) {
      return res.status(404).json({ error: 'Video chat session not found' });
    }
    
    // Verify user is participant
    if (req.user.id !== videoChat.studentId.toString() && 
        req.user.id !== videoChat.mentorId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Generate token
    const token = generateAgoraToken(
      sessionId,
      req.user.id,
      role
    );
    
    // Update video chat with token
    videoChat.token = token;
    await videoChat.save();
    
    res.json({
      success: true,
      token,
      appId: process.env.AGORA_APP_ID,
      sessionId,
      uid: req.user.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate token' });
  }
});
```

### Step 4: Create Video Chat Component

Create `client/src/components/VideoChat.jsx`:
```javascript
import { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Phone, PhoneOff, Maximize2, Minimize2 } from 'lucide-react';

function VideoChat({ sessionId, userData, onClose }) {
  const [users, setUsers] = useState([]);
  const [localScreenSharing, setLocalScreenSharing] = useState(false);
  const containerRef = useRef(null);
  const agoraEngineRef = useRef(null);

  useEffect(() => {
    const initializeAgora = async () => {
      try {
        // Get token from backend
        const response = await fetch(`http://localhost:3000/video-chat/${sessionId}/token`, {
          credentials: 'include'
        });
        
        const data = await response.json();
        const { token, appId, uid } = data;

        // Initialize Agora
        const engine = AgoraRTC.createClient({
          mode: 'rtc',
          codec: 'vp8'
        });

        // Handle remote users
        engine.on('user-published', async (user, mediaType) => {
          await engine.subscribe(user, mediaType);
          if (mediaType === 'video') {
            setUsers(prevUsers => [...prevUsers, user]);
          }
        });

        engine.on('user-unpublished', async (user) => {
          await engine.unsubscribe(user);
          setUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
        });

        // Join channel
        await engine.join(appId, sessionId, token, parseInt(uid));

        // Create local video tracks
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();

        // Publish local tracks
        await engine.publish([audioTrack, videoTrack]);

        // Play local video
        videoTrack.play('local-video');

        agoraEngineRef.current = engine;
      } catch (error) {
        console.error('Failed to initialize Agora:', error);
      }
    };

    initializeAgora();

    return () => {
      agoraEngineRef.current?.leave();
    };
  }, [sessionId, userData?.id]);

  const handleEndCall = async () => {
    try {
      agoraEngineRef.current?.leave();
      onClose();
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="w-full h-full max-w-6xl bg-gray-900 rounded-lg overflow-hidden">
        
        {/* Video Container */}
        <div className="grid grid-cols-2 gap-2 p-4 h-full">
          {/* Local Video */}
          <div className="bg-black rounded-lg overflow-hidden relative">
            <div id="local-video" className="w-full h-full" />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You
            </div>
          </div>

          {/* Remote Video */}
          <div className="bg-black rounded-lg overflow-hidden relative">
            {users.length > 0 ? (
              <div
                id={`remote-video-${users[0].uid}`}
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Waiting for peer to connect...
              </div>
            )}
            {users.length > 0 && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {users[0].videoTrack ? 'Mentor' : 'Audio Only'}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition"
          >
            <PhoneOff size={32} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoChat;
```

### Step 5: Integrate into TaskDetail

In `TaskDetail.jsx`, add video chat button:
```javascript
import VideoChat from './VideoChat';

// In component state
const [showVideoChat, setShowVideoChat] = useState(false);
const [videoSessionId, setVideoSessionId] = useState(null);

// When video chat is accepted
const startVideoChat = (sessionId) => {
  setVideoSessionId(sessionId);
  setShowVideoChat(true);
};

// In JSX
{showVideoChat && videoSessionId && (
  <VideoChat 
    sessionId={videoSessionId}
    userData={userData}
    onClose={() => setShowVideoChat(false)}
  />
)}
```

### Step 6: Add API Integration

In `client/src/utils/api.js`:
```javascript
export const getVideoChatToken = async (sessionId) => {
  return apiCall(`/video-chat/${sessionId}/token`);
};
```

---

## Deployment Considerations

### Environment Variables
```env
AGORA_APP_ID=your_production_app_id
AGORA_APP_CERTIFICATE=your_production_certificate
NODE_ENV=production
```

### Security
- Always validate token requests
- Verify user is participant in video chat
- Implement rate limiting on token generation
- Use HTTPS in production

### Performance
- Implement video quality adaptation
- Monitor bandwidth usage
- Set appropriate bitrate limits
- Handle network interruptions

---

## Testing Agora Integration

### Test Flow
1. Open two browser windows
2. Student requests video chat from TaskDetail
3. Mentor accepts request
4. Both click "Join Video Chat"
5. Should see each other's video
6. Can end call anytime

### Common Issues & Solutions

**Issue**: "Token Expired"
- Solution: Regenerate token, default is 1 hour

**Issue**: "No Permission"
- Solution: Check Agora app ID and certificate are correct

**Issue**: "Network Error"
- Solution: Check firewall, CORS settings, network connectivity

**Issue**: "No Video/Audio"
- Solution: Check browser permissions, device is connected

---

## Cost Estimation

### Agora Pricing (as of 2024)
- Free tier: 10,000 minutes/month
- Premium: $0.99-4.99 per 1000 minutes
- For 100 daily active users with 1-hour sessions:
  - ~3,000 minutes/month
  - Falls within free tier!

---

## Alternative Implementations

### Quick Implementation (No Video)
Instead of full video, implement:
- Email notifications with Zoom/Google Meet link
- Scheduled meeting times
- Async feedback system

### Browser-based WebRTC (Advanced)
- Use PeerJS library
- Server-side signaling only
- Lower cost but more complex

---

## Next Steps

1. ✅ Choose video service (recommended: Agora)
2. ✅ Sign up and get credentials
3. ✅ Follow integration steps above
4. ✅ Test with multiple users
5. ✅ Deploy to production

---

## Support Resources

- **Agora Documentation**: https://docs.agora.io
- **Agora SDK Downloads**: https://github.com/AgoraIO
- **Agora Support**: https://agora-ticket.agora.io
- **MentorConnect Team**: Check IMPLEMENTATION_GUIDE.md

---

**Version**: 1.0.0  
**Last Updated**: January 3, 2026
