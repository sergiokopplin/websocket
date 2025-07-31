import Link from "next/link";
import { useState } from "react";
import { useCall } from "../components/CallProvider";
import { ConsentSwitch } from "../components/ConsentSwitch";

export default function Home() {
  const {
    activeCall,
    isConnected,
    featureEnabled,
    setFeatureEnabled,
    handleConsentChange,
    globalConsent,
  } = useCall();
  const [loading, setLoading] = useState(false);

  const handleStartCallForExpert = async (expertId, expertName) => {
    setLoading(true);
    try {
      const response = await fetch("/api/call/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expertId,
          expertName,
          cstId: "cst_current_user",
        }),
      });

      const result = await response.json();
      console.log("Call started for expert:", expertId, result);
    } catch (error) {
      console.error("Error starting call:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCallForExpert = async (expertId) => {
    setLoading(true);
    try {
      const response = await fetch("/api/call/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expertId }),
      });

      const result = await response.json();
      console.log("Call ended for expert:", expertId, result);
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

          {/* Recording Consent */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recording Consent</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Enable recording for all calls. You must consent before any
                    recording can start.
                  </p>
                  <ConsentSwitch
                    isEnabled={globalConsent}
                    onChange={handleConsentChange}
                  />
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    globalConsent
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {globalConsent ? "Recording Enabled" : "Recording Disabled"}
                </div>
              </div>
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

          {/* Recording Consent */}
          {activeCall && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recording Consent</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Control recording for the current call
                    </p>
                    <ConsentSwitch
                      isEnabled={activeCall.isRecordingConsented}
                      onChange={handleConsentChange}
                    />
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeCall.isRecordingConsented
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {activeCall.status === "waiting_consent"
                      ? "Waiting for Consent"
                      : "Recording Active"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Navigation</h2>
            <div className="flex gap-4">
              <Link
                href="/another-page"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Another Page
              </Link>

              <Link
                href="/test-tabs"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Tab Test
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

          {/* Multi-Expert Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Multi-Expert Test</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Expert 123</h3>
                <div className="flex gap-2">
                  <Link
                    href="/expert/123"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Go to Expert 123
                  </Link>
                  <button
                    onClick={() => window.open("/expert/123", "_blank")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    New Tab Expert 123
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Expert 456</h3>
                <div className="flex gap-2">
                  <Link
                    href="/expert/456"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Go to Expert 456
                  </Link>
                  <button
                    onClick={() => window.open("/expert/456", "_blank")}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    New Tab Expert 456
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Test:</strong> Open multiple tabs with different
                experts, start a call for a specific expert and see that it only
                appears in the correct tab!
              </p>
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Call Simulation by Expert
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">
                  Expert 123 - Dr. John Smith
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      handleStartCallForExpert("123", "Dr. John Smith")
                    }
                    disabled={
                      loading ||
                      activeCall?.expertId === "123" ||
                      !globalConsent
                    }
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Call Expert 123
                  </button>
                  <button
                    onClick={() => handleEndCallForExpert("123")}
                    disabled={loading || activeCall?.expertId !== "123"}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    End Call Expert 123
                  </button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">
                  Expert 456 - Dr. Mary Santos
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      handleStartCallForExpert("456", "Dr. Mary Santos")
                    }
                    disabled={
                      loading ||
                      activeCall?.expertId === "456" ||
                      !globalConsent
                    }
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Call Expert 456
                  </button>
                  <button
                    onClick={() => handleEndCallForExpert("456")}
                    disabled={loading || activeCall?.expertId !== "456"}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    End Call Expert 456
                  </button>
                </div>
              </div>
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
              <li>• TypeScript support for better development experience</li>
              <li>• Improved error handling and validation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
