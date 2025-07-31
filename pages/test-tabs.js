import Link from "next/link";
import { useCall } from "../components/CallProvider";

export default function TestTabs() {
  const { activeCall, isConnected } = useCall();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Tab Synchronization Test
            </h1>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Connection Status */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
            <div
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                isConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>

          {/* Call Status */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Call Status</h2>
            {activeCall ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-800">
                    Active Call Detected!
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Call ID:</span>
                    <p className="font-mono">{activeCall.callId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Expert:</span>
                    <p>{activeCall.expertName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Expert ID:</span>
                    <p>{activeCall.expertId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="capitalize">{activeCall.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Start:</span>
                    <p>{activeCall.startTime.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600">
                    No active call at the moment
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Test Instructions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              How to Test Synchronization
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ol className="text-sm text-blue-700 space-y-2">
                <li>
                  <strong>1.</strong> Open this page in multiple tabs
                </li>
                <li>
                  <strong>2.</strong> Go to the home page (/) in one of the tabs
                </li>
                <li>
                  <strong>3.</strong> Click "Start Call" to start a call
                </li>
                <li>
                  <strong>4.</strong> Go back to the other tabs - the call should
                  appear automatically!
                </li>
                <li>
                  <strong>5.</strong> Test navigating between different pages
                  (/expert/123, /expert/456)
                </li>
                <li>
                  <strong>6.</strong> The status bar should appear in all
                  relevant tabs
                </li>
              </ol>
            </div>
          </div>

          {/* Test Links */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Test Pages</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/expert/123"
                className="p-4 bg-purple-100 border border-purple-200 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <h3 className="font-semibold text-purple-800">Expert 123</h3>
                <p className="text-sm text-purple-600">
                  Test with expert ID 123
                </p>
              </Link>
              <Link
                href="/expert/456"
                className="p-4 bg-green-100 border border-green-200 rounded-lg hover:bg-green-200 transition-colors"
              >
                <h3 className="font-semibold text-green-800">Expert 456</h3>
                <p className="text-sm text-green-600">
                  Test with expert ID 456
                </p>
              </Link>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Debug Information:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• WebSocket Connected: {isConnected ? "Yes" : "No"}</p>
              <p>• Active Call: {activeCall ? "Yes" : "No"}</p>
              {activeCall && (
                <>
                  <p>• Call Expert ID: {activeCall.expertId}</p>
                  <p>• Call ID: {activeCall.callId}</p>
                  <p>• Status: {activeCall.status}</p>
                </>
              )}
              <p>• Timestamp: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
