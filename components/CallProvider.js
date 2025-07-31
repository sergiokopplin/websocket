import { useRouter } from "next/router";
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
  const router = useRouter();
  const [featureEnabled, setFeatureEnabled] = useState(true);
  const { callStatus, isConnected, sendMessage } = useWebSocket(featureEnabled);
  const [activeCall, setActiveCall] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [globalConsent, setGlobalConsent] = useState(false);

  // Check initial consent state
  useEffect(() => {
    const checkConsent = async () => {
      try {
        const response = await fetch("/api/consent");
        const data = await response.json();
        if (data.success) {
          setGlobalConsent(data.globalConsent);
        }
      } catch (error) {
        console.error("Error checking consent state:", error);
      }
    };

    checkConsent();
  }, []);

  // Get expertId from current route
  const currentExpertId = router.query.id || router.query.expertId;

  // Check for active call when loading the page
  useEffect(() => {
    const checkCurrentCall = async () => {
      try {
        const response = await fetch("/api/call/status");
        const data = await response.json();

        if (data.hasActiveCall && data.callInfo) {
          console.log("Found active call on page load:", data.callInfo);

          // If we're on a specific expert page, check if the call is for this expert
          if (currentExpertId) {
            if (data.callInfo.expertId === currentExpertId) {
              setActiveCall({
                ...data.callInfo,
                startTime: new Date(data.callInfo.startTime),
              });
            }
          } else {
            // If we're on the main page, show any active call
            setActiveCall({
              ...data.callInfo,
              startTime: new Date(data.callInfo.startTime),
            });
          }
        }
      } catch (error) {
        console.error("Error checking current call:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    if (isConnected && !isInitialized) {
      checkCurrentCall();
    }
  }, [isConnected, currentExpertId, isInitialized]);

  // Update call when receiving updates via WebSocket
  useEffect(() => {
    if (!callStatus) return;

    console.log("Received call status update:", callStatus);
    console.log("Current expert ID:", currentExpertId);

    if (!activeCall) {
      // New call
      if (currentExpertId) {
        // If we're on a specific expert page, only show if it's for this expert
        if (callStatus.expertId === currentExpertId) {
          console.log("Setting active call for current expert:", callStatus);
          setActiveCall(callStatus);
        }
      } else {
        // If we're on the main page, show any call
        console.log("Setting active call for main page:", callStatus);
        setActiveCall(callStatus);
      }
    } else {
      // Update existing call
      if (currentExpertId) {
        // If we're on a specific expert page
        if (callStatus.expertId === currentExpertId) {
          setActiveCall(callStatus);
        } else {
          // If the call is not for this expert, clear it
          setActiveCall(null);
        }
      } else {
        // If we're on the main page, update any call
        setActiveCall(callStatus);
      }
    }
  }, [callStatus, activeCall, currentExpertId]);

  // Clear call when it ends
  useEffect(() => {
    if (callStatus === null && activeCall) {
      console.log("Clearing active call");
      setActiveCall(null);
    }
  }, [callStatus, activeCall]);

  // Sync state between tabs using localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "activeCall") {
        try {
          const callData = e.newValue ? JSON.parse(e.newValue) : null;
          console.log("Storage change detected:", callData);

          if (callData) {
            // Check if the call is relevant for this page
            if (currentExpertId) {
              if (callData.expertId === currentExpertId) {
                setActiveCall({
                  ...callData,
                  startTime: new Date(callData.startTime),
                });
              }
            } else {
              // Main page - show any call
              setActiveCall({
                ...callData,
                startTime: new Date(callData.startTime),
              });
            }
          } else {
            setActiveCall(null);
          }
        } catch (error) {
          console.error("Error parsing storage data:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentExpertId]);

  // Update localStorage when call changes
  useEffect(() => {
    if (activeCall) {
      localStorage.setItem("activeCall", JSON.stringify(activeCall));
      console.log("Updated localStorage with active call:", activeCall);
    } else {
      localStorage.removeItem("activeCall");
      console.log("Removed active call from localStorage");
    }
  }, [activeCall]);

  const handleStopRecording = useCallback(() => {
    if (activeCall) {
      console.log("Stopping recording for call:", activeCall.callId);
      sendMessage({ type: "STOP_RECORDING", callId: activeCall.callId });
    }
  }, [activeCall, sendMessage]);

  const handleConsentChange = useCallback(async (newConsent) => {
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: newConsent }),
      });
      setGlobalConsent(newConsent);
    } catch (error) {
      console.error("Error updating consent:", error);
    }
  }, []);

  const contextValue = {
    activeCall,
    isConnected,
    sendMessage,
    featureEnabled,
    setFeatureEnabled,
    handleConsentChange,
    globalConsent,
  };

  return (
    <CallContext.Provider value={contextValue}>
      {children}
      {featureEnabled && activeCall && (
        <CallStatusBarPortal
          call={activeCall}
          onStopRecording={handleStopRecording}
        />
      )}
    </CallContext.Provider>
  );
};
