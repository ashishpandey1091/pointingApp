import React from 'react';

export default function Header({ currentUser, sessionId, onLogout }) {
  return (
    <header className="bg-gray-800 rounded-lg shadow-lg p-4 mb-8 flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-3xl font-bold">Team Pointing App</h1>
      {currentUser && (
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="text-sm">
            <span className="text-gray-400">Logged in as:</span> {currentUser.name}
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}