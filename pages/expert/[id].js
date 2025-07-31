import Link from "next/link";
import { useRouter } from "next/router";
import { useCall } from "../../components/CallProvider";

export default function ExpertPage() {
  const router = useRouter();
  const { id } = router.query;
  const { activeCall, isConnected } = useCall();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Expert {id}</h1>
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

          {/* Active Call Status */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Call Status</h2>
            {activeCall ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-800">
                    Active Call for Expert {id}
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
                    No active call for this expert
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">How to Test:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Go to the home page (/)</li>
              <li>2. Click "Start Call" to start a call</li>
              <li>3. Navigate back to this page (/expert/{id})</li>
              <li>4. The status bar should appear automatically</li>
              <li>5. No refresh needed!</li>
            </ol>
          </div>

          {/* Debug Info */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Debug Information:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Expert ID: {id}</p>
              <p>• WebSocket Connected: {isConnected ? "Yes" : "No"}</p>
              <p>• Active Call: {activeCall ? "Yes" : "No"}</p>
              {activeCall && <p>• Call Expert ID: {activeCall.expertId}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
