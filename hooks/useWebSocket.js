import { useCallback, useEffect, useRef, useState } from "react";

export const useWebSocket = (enabled) => {
  const [callStatus, setCallStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const shouldReconnect = useRef(true);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      // WebSocket URL para Next.js
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/ws`;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message:", data);

          switch (data.type) {
            case "CALL_STARTED":
              setCallStatus({
                callId: data.callId,
                expertId: data.expertId,
                expertName: data.expertName,
                startTime: new Date(data.startTime),
                status: "recording",
              });
              break;

            case "CALL_STATUS_UPDATE":
              setCallStatus((prev) =>
                prev ? { ...prev, ...data.updates } : null
              );
              break;

            case "CALL_ENDED":
              setCallStatus((prev) =>
                prev ? { ...prev, status: "completed" } : null
              );
              setTimeout(() => setCallStatus(null), 3000);
              break;

            case "CALL_ERROR":
              setCallStatus((prev) =>
                prev
                  ? {
                      ...prev,
                      status: "error",
                      errorMessage: data.errorMessage,
                    }
                  : null
              );
              setTimeout(() => setCallStatus(null), 3000);
              break;

            case "CURRENT_CALL_STATE":
              if (data.hasActiveCall) {
                setCallStatus({
                  ...data.callInfo,
                  startTime: new Date(data.callInfo.startTime),
                });
              } else {
                setCallStatus(null);
              }
              break;

            default:
              console.warn("Unknown WebSocket message type:", data.type);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code);
        setIsConnected(false);

        if (shouldReconnect.current && event.code !== 1000) {
          reconnectTimeout.current = setTimeout(connect, 5000);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message:", message);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      shouldReconnect.current = false;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close(1000, "Feature disabled");
      }
      setIsConnected(false);
      setCallStatus(null);
    }

    return () => {
      shouldReconnect.current = false;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close(1000, "Component unmounting");
      }
    };
  }, [connect, enabled]);

  return { callStatus, isConnected, sendMessage };
};
