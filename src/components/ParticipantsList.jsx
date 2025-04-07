import React from 'react';
import { USER_ROLES, SESSION_STATUS } from '../models/types';

export default function ParticipantsList({ participants, sessionStatus }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Participants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map(p => (
          <div key={p.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
            <div>
              <span className="font-medium">{p.name}</span>
              <span className="text-sm text-gray-400 ml-2">
                {p.role === USER_ROLES.OBSERVER ? '(Observer)' : '(Voter)'}
              </span>
            </div>
            {p.role === USER_ROLES.VOTER && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                p.vote !== null ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                {sessionStatus === SESSION_STATUS.REVEALED && p.vote !== null ? p.vote : p.vote !== null ? '✓' : '?'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}