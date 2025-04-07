import React, { useState } from 'react';
import SessionCreationForm from './SessionCreationForm';
import JoinSessionForm from './JoinSessionForm';

export default function LandingPage({ onCreateSession, onJoinSession }) {
  const [activeTab, setActiveTab] = useState('join');
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Team Pointing App</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'join' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('join')}
          >
            Join Session
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('create')}
          >
            Create Session
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'join' ? (
            <JoinSessionForm onJoinSession={onJoinSession} />
          ) : (
            <SessionCreationForm onCreateSession={onCreateSession} />
          )}
        </div>
      </div>
      
      <div className="text-center text-gray-400 text-sm">
        <p>Create or join a pointing session to estimate tasks with your team</p>
      </div>
    </div>
  );
}