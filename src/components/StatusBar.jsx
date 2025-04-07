import React from 'react';
import { SESSION_STATUS, USER_ROLES } from '../models/types';

export default function StatusBar({ currentUser, sessionStatus, votingStatus }) {
  const getStatusText = () => {
    switch(sessionStatus) {
      case SESSION_STATUS.ACTIVE:
        return 'Voting in Progress';
      case SESSION_STATUS.REVEALED:
        return 'Votes Revealed';
      default:
        return 'Waiting to Start';
    }
  };

  const getStatusClass = () => {
    switch(sessionStatus) {
      case SESSION_STATUS.ACTIVE:
        return 'bg-green-600';
      case SESSION_STATUS.REVEALED:
        return 'bg-amber-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div>
          <span className="font-medium">You:</span> {currentUser.name} ({currentUser.role === USER_ROLES.OBSERVER ? 'Observer' : 'Voter'})
        </div>
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusClass()}`}>
            {getStatusText()}
          </span>
        </div>
        <div>{votingStatus}</div>
      </div>
    </div>
  );
}