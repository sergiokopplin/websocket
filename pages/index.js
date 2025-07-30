import Link from "next/link";
import { useState } from "react";
import { useCall } from "../components/CallProvider";

export default function Home() {
  const { activeCall, isConnected, featureEnabled, setFeatureEnabled } =
    useCall();
  const [loading, setLoading] = useState(false);

  const handleStartCall = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/call/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expertName: "Dr. Mary Santos",
        }),
      });

      const result = await response.json();
      console.log("Call started:", result);
    } catch (error) {
      console.error("Error starting call:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/call/end", {
        method: "POST",
      });

      const result = await response.json();
      console.log("Call ended:", result);
    } catch (error) {
      console.error("Error ending call:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Call Detection System - Next.js
          </h1>

          {/* Connection Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              WebSocket Connection Status
            </h2>
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                isConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>

          {/* Feature Flag Control */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Feature Flag</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={featureEnabled}
                  onChange={(e) => setFeatureEnabled(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                    featureEnabled ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      featureEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="ml-3 text-lg font-medium">
                  Feature Flag {featureEnabled ? "Activated" : "Disabled"}
                </span>
              </label>
            </div>

            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Feature Flag:</strong> {featureEnabled ? "ON" : "OFF"} -
                {featureEnabled
                  ? "WebSocket connected, calls will be detected"
                  : "WebSocket disconnected, no calls will be shown"}
              </p>
            </div>
          </div>

          {/* Active Call */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Call</h2>
            {activeCall ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Call ID</p>
                    <p className="text-lg">{activeCall.callId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Expert</p>
                    <p className="text-lg">{activeCall.expertName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-lg capitalize">{activeCall.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Start</p>
                    <p className="text-lg">
                      {activeCall.startTime.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-500">No active call at the moment</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Navigation</h2>
            <div className="flex gap-4">
              <Link
                href="/another-page"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Another Page
              </Link>

              <button
                onClick={() => window.open("/another-page", "_blank")}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Open New Tab
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Test the call bar on different pages and tabs
            </p>
          </div>

          {/* Simulation Controls */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Call Simulation</h2>
            <div className="flex gap-4">
              <button
                onClick={handleStartCall}
                disabled={loading || !!activeCall || !featureEnabled}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Starting..." : "Start Call"}
              </button>

              <button
                onClick={handleEndCall}
                disabled={loading || !activeCall || !featureEnabled}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Ending..." : "End Call"}
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong>
                <br />
                1. Click "Start Call" to simulate the start of a call
                <br />
                2. The status bar will appear at the top of the screen
                <br />
                3. You can drag the bar to reposition it
                <br />
                4. Use "Stop Recording" in the bar or "End Call" here to finish
              </p>
            </div>
          </div>

          {/* Technical Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">
              Technical Information
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• WebSocket working in real-time</li>
              <li>• State synchronized between tabs</li>
              <li>• State recovery when reloading page</li>
              <li>• Automatic reconnection in case of disconnection</li>
              <li>• Draggable bar that works on all pages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
