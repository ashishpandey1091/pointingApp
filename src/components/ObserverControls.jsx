import React, { useEffect } from 'react';
import { SESSION_STATUS } from '../models/types';

export default function ObserverControls({ sessionStatus, onStart, onEnd }) {
  const [currentSessionStatus, setCurrentSessionStatus] = React.useState(sessionStatus);
  
  // Update local state when props change
  useEffect(() => {
    console.log("ObserverControls: sessionStatus prop changed to:", sessionStatus);
    setCurrentSessionStatus(sessionStatus);
  }, [sessionStatus]);

  const handleStart = () => {
    console.log("Start button clicked");
    onStart();
    // No need to set state here as it will update via props
  };

  const handleEnd = () => {
    console.log("End button clicked");
    onEnd();
    // No need to set state here as it will update via props
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Observer Controls</h2>
      <div className="flex gap-4">
        <button
          onClick={handleStart}
          disabled={currentSessionStatus === SESSION_STATUS.ACTIVE}
          className={`px-6 py-2 rounded font-medium transition-colors ${
            currentSessionStatus === SESSION_STATUS.ACTIVE ? 'bg-gray-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          Start Pointing
        </button>
        <button
          onClick={handleEnd}
          disabled={currentSessionStatus !== SESSION_STATUS.ACTIVE}
          className={`px-6 py-2 rounded font-medium transition-colors ${
            currentSessionStatus !== SESSION_STATUS.ACTIVE ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          End & Reveal
        </button>
      </div>
    </div>
  );
}