import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import { CallStatusBar } from "./CallStatusBar";

const CallContext = createContext();

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within CallProvider");
  }
  return context;
};

const CallStatusBarPortal = ({ call, onStopRecording }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!call || !mounted) return null;

  return createPortal(
    <CallStatusBar call={call} onStopRecording={onStopRecording} />,
    document.body
  );
};

export const CallProvider = ({ children }) => {
  const { callStatus, isConnected, sendMessage } = useWebSocket();
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    if (callStatus && !activeCall) {
      console.log("New call detected:", callStatus);
      setActiveCall(callStatus);
    } else if (!callStatus && activeCall) {
      console.log("Call ended");
      setActiveCall(null);
    } else if (callStatus && activeCall) {
      setActiveCall(callStatus);
    }
  }, [callStatus, activeCall]);

  const handleStopRecording = useCallback(() => {
    if (activeCall) {
      console.log("Stopping recording for call:", activeCall.callId);
      sendMessage({ type: "STOP_RECORDING", callId: activeCall.callId });
    }
  }, [activeCall, sendMessage]);

  const contextValue = {
    activeCall,
    isConnected,
    sendMessage,
  };

  return (
    <CallContext.Provider value={contextValue}>
      {children}
      <CallStatusBarPortal
        call={activeCall}
        onStopRecording={handleStopRecording}
      />
    </CallContext.Provider>
  );
};
