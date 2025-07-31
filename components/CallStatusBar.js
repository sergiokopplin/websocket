import { useEffect, useRef, useState } from "react";

const CallTimer = ({ startTime }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000);
      setDuration(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return <span className="font-mono text-white">{formatTime(duration)}</span>;
};

const MicSensitivityBars = () => {
  const [levels, setLevels] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLevels((prev) => prev.map(() => Math.random() * 100));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-1 h-6">
      {levels.map((level, index) => (
        <div
          key={index}
          className="w-1 bg-green-400 transition-all duration-200"
          style={{ height: `${Math.max(10, level)}%` }}
        />
      ))}
    </div>
  );
};

export const CallStatusBar = ({ call, onStopRecording }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e) => {
      e.preventDefault();
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      // Limites da tela
      const maxX = window.innerWidth - 400; // width do componente
      const maxY = window.innerHeight - 60; // height aproximado do componente

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = (e) => {
      e.preventDefault();
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getStatusColor = () => {
    switch (call.status) {
      case "waiting_consent":
        return "bg-yellow-600";
      case "recording":
        return "bg-red-600";
      case "transcribing":
        return "bg-yellow-600";
      case "completed":
        return "bg-green-600";
      case "error":
        return "bg-red-800";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusText = () => {
    switch (call.status) {
      case "waiting_consent":
        return "Waiting for Consent";
      case "recording":
        return "Recording";
      case "transcribing":
        return "Transcribing";
      case "completed":
        return "Completed";
      case "error":
        return "Call Error";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      ref={dragRef}
      className={`fixed z-50 ${getStatusColor()} text-white px-4 py-2 rounded-lg shadow-lg select-none transition-colors ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        left: position.x === 0 && position.y === 0 ? "50%" : `${position.x}px`,
        top: position.x === 0 && position.y === 0 ? "20px" : `${position.y}px`,
        marginLeft: position.x === 0 && position.y === 0 ? "-200px" : 0,
        width: "400px",
        pointerEvents: "auto",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                call.status === "recording"
                  ? "bg-red-300 animate-pulse"
                  : "bg-white"
              }`}
            />
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>

          <div className="text-sm">
            <CallTimer startTime={call.startTime} />
          </div>

          <MicSensitivityBars />

          <span className="text-sm font-medium">{call.expertName}</span>
          {call.errorMessage && (
            <span className="ml-2 text-sm text-red-200">
              {call.errorMessage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {call.status === "recording" ? (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetch("/api/call/error", { method: "POST" });
                }}
                className="bg-red-900 hover:bg-red-950 px-3 py-1 rounded text-xs font-medium transition-colors"
                style={{ pointerEvents: "auto" }}
              >
                Simulate Error
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStopRecording();
                }}
                className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-xs font-medium transition-colors"
                style={{ pointerEvents: "auto" }}
              >
                Stop Recording
              </button>
            </div>
          ) : (
            <button
              className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-xs font-medium transition-colors opacity-50 cursor-not-allowed"
              disabled
              style={{ pointerEvents: "auto" }}
            >
              {call.status === "error" ? "Call Error" : "End Call"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
