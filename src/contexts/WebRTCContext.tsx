
"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSocket } from './SocketContext';
import Peer from 'simple-peer';

interface WebRTCContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCalling: boolean;
  callAccepted: boolean;
  callUser: (userId: string) => void;
  acceptCall: () => void;
  endCall: () => void;
  callEnded: boolean;
  caller: string;
}

const WebRTCContext = createContext<WebRTCContextType>({} as WebRTCContextType);

export const useWebRTC = () => {
  return useContext(WebRTCContext);
};

export const WebRTCProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);

  const connectionRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
      } catch (error) {
        console.error('Failed to get media stream', error);
      }
    };

    getMedia();

    if (socket) {
      socket.on('call-user', (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      });

      socket.on('call-ended', () => {
        setCallEnded(true);
        setCallAccepted(false);
        setIsCalling(false);
        setReceivingCall(false);
        connectionRef.current?.destroy();
      });
    }
  }, [socket]);

  const callUser = (userId: string) => {
    setIsCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: localStream!,
    });

    peer.on('signal', (data) => {
      socket?.emit('call-user', {
        userToCall: userId,
        signalData: data,
        from: socket.id,
      });
    });

    peer.on('stream', (stream) => {
      setRemoteStream(stream);
    });

    socket?.on('call-accepted', (signal) => {
      setCallAccepted(true);
      setIsCalling(false);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const acceptCall = () => {
    setCallAccepted(true);
    setReceivingCall(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream!,
    });

    peer.on('signal', (data) => {
      socket?.emit('accept-call', { signal: data, to: caller });
    });

    peer.on('stream', (stream) => {
      setRemoteStream(stream);
    });

    peer.signal(callerSignal);

    connectionRef.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setIsCalling(false);
    setReceivingCall(false);
    connectionRef.current?.destroy();
    socket?.emit('end-call', { to: caller });
  };

  return (
    <WebRTCContext.Provider value={{ localStream, remoteStream, isCalling, callAccepted, callUser, acceptCall, endCall, callEnded, caller }}>
      {children}
    </WebRTCContext.Provider>
  );
};
