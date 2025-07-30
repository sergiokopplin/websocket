import Link from "next/link";
import { useCall } from "../components/CallProvider";

export default function AnotherPage() {
  const { activeCall } = useCall();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Another Page
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            This is another page to demonstrate that the call bar appears on all
            pages of the application.
          </p>

          {activeCall && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                ✅ Active call detected:{" "}
                <strong>{activeCall.expertName}</strong>
              </p>
            </div>
          )}

          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
