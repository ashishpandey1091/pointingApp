import React, { useState } from 'react';

export default function JoinSessionForm({ onJoinSession }) {
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isObserver, setIsObserver] = useState(false);

  const handleSubmit = () => {
    const result = onJoinSession(sessionId, name, isObserver);
    console.log("JoinSessionForm: handleSubmit result:", result);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Join an Existing Session</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="sessionId" className="block text-sm font-medium mb-1">Session ID</label>
          <input
            id="sessionId"
            type="text"
            placeholder="Enter session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="observer"
            checked={isObserver}
            onChange={(e) => setIsObserver(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          <label htmlFor="observer">Join as Observer</label>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
        >
          Join Session
        </button>
      </div>
    </div>
  );
}