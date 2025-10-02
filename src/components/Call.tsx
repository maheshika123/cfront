
"use client";

import { useWebRTC } from '../contexts/WebRTCContext';

const Call = () => {
  const { remoteStream, isCalling, callAccepted, acceptCall, endCall, callEnded, caller, localStream } = useWebRTC();

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {isCalling && !callAccepted && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Calling...</h2>
            <button onClick={endCall} className="bg-red-500 text-white px-6 py-2 rounded-lg mt-4">End Call</button>
          </div>
        )}
        {!isCalling && !callAccepted && caller && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Incoming Call</h2>
            <div className="flex justify-center space-x-4">
              <button onClick={acceptCall} className="bg-green-500 text-white px-6 py-2 rounded-lg">Accept</button>
              <button onClick={endCall} className="bg-red-500 text-white px-6 py-2 rounded-lg">Decline</button>
            </div>
          </div>
        )}
        {callAccepted && !callEnded && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Call in Progress</h2>
            <div className="flex space-x-4">
              {localStream && <audio ref={ref => { if (ref) ref.srcObject = localStream; }} autoPlay muted />}
              {remoteStream && <audio ref={ref => { if (ref) ref.srcObject = remoteStream; }} autoPlay />}
            </div>
            <button onClick={endCall} className="bg-red-500 text-white px-6 py-2 rounded-lg mt-4">End Call</button>
          </div>
        )}
        {callEnded && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Call Ended</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Call;
