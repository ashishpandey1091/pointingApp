import React, { useState } from 'react';

export default function SessionCreationForm({ onCreateSession }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    
    const sessionId = onCreateSession(name);
    // SessionId is returned to display to the user
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Create a New Session</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-grow px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-medium transition-colors"
        >
          Create Session
        </button>
      </div>
    </div>
  );
}