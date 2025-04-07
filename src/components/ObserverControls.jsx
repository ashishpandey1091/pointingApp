import React from 'react';
import { SESSION_STATUS } from '../models/types';

export default function ObserverControls({ sessionStatus, onStart, onEnd }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Observer Controls</h2>
      <div className="flex gap-4">
        <button
          onClick={onStart}
          disabled={sessionStatus === SESSION_STATUS.ACTIVE}
          className={`px-6 py-2 rounded font-medium transition-colors ${
            sessionStatus === SESSION_STATUS.ACTIVE ? 'bg-gray-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          Start Pointing
        </button>
        <button
          onClick={onEnd}
          disabled={sessionStatus !== SESSION_STATUS.ACTIVE}
          className={`px-6 py-2 rounded font-medium transition-colors ${
            sessionStatus !== SESSION_STATUS.ACTIVE ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          End & Reveal
        </button>
      </div>
    </div>
  );
}