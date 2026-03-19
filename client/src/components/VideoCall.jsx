import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Share2, Copy, Download } from 'lucide-react';
import { requestVideoChat, completeVideoChat } from '../utils/api';

function VideoCall({ sessionId, userData, mentorData, onClose }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [callStats, setCallStats] = useState({
    bitrate: 0,
    packetLoss: 0,
    latency: 0
  });

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const callTimerRef = useRef(null);

  // Initialize WebRTC
  useEffect(() => {
    if (isCallActive) {
      initializeWebRTC();
    }
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isCallActive]);

  // Update call duration
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isCallActive]);

  const initializeWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        audio: isMicEnabled
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
        }
      };

      // Get connection stats
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
      };

      // For demo: auto-answer (in production, use WebSocket signaling)
      if (userData.role === 'mentor') {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        // Send offer via WebSocket or API
      }

    } catch (err) {
      setError('Failed to initialize video call: ' + err.message);
      console.error('WebRTC error:', err);
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicEnabled(!isMicEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        screenStreamRef.current = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false
        });

        const screenTrack = screenStreamRef.current.getVideoTracks()[0];
        const sender = peerConnectionRef.current
          .getSenders()
          .find(s => s.track?.kind === 'video');

        await sender.replaceTrack(screenTrack);

        screenTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
      } else {
        // Stop screen sharing
        screenStreamRef.current.getTracks().forEach(track => track.stop());

        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        const sender = peerConnectionRef.current
          .getSenders()
          .find(s => s.track?.kind === 'video');

        await sender.replaceTrack(videoTrack);
        setIsScreenSharing(false);
      }
    } catch (err) {
      setError('Screen sharing failed: ' + err.message);
    }
  };

  const endCall = async () => {
    try {
      // Stop all tracks
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();

      // Notify backend
      if (sessionId) {
        await completeVideoChat(sessionId, {
          duration: callDuration
        });
      }

      setIsCallActive(false);
      onClose();
    } catch (err) {
      setError('Failed to end call: ' + err.message);
    }
  };

  const startCall = () => {
    setIsCallActive(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isCallActive) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Video Call</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Calling with:</p>
              <p className="text-lg font-semibold text-gray-800">{mentorData?.name || 'User'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Session ID:</p>
              <p className="font-mono text-xs text-gray-700 break-all">{sessionId}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startCall}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Start Call
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium flex items-center justify-center gap-2"
            >
              <PhoneOff size={20} />
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{mentorData?.name || 'User'}</h3>
          <p className="text-sm text-gray-400">{formatTime(callDuration)}</p>
        </div>
        <div className="text-sm text-gray-400">
          Bitrate: {callStats.bitrate} kbps | Latency: {callStats.latency}ms
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (Picture in Picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-4 border-white shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff size={32} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg max-w-sm">
            {error}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-center gap-4">
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full transition ${
            isMicEnabled
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
          title={isMicEnabled ? 'Mute' : 'Unmute'}
        >
          {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition ${
            isVideoEnabled
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
          title={isVideoEnabled ? 'Stop Video' : 'Start Video'}
        >
          {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-4 rounded-full transition ${
            isScreenSharing
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
        >
          <Share2 size={24} />
        </button>

        <div className="w-px h-8 bg-gray-700" />

        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
          title="End Call"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
