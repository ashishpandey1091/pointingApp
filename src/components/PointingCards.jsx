import React from 'react';
import { SESSION_STATUS } from '../models/types';

export default function PointingCards({ sessionStatus, pointValues, selectedPoint, onSelectPoint }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Vote</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {pointValues.map(point => (
          <button
            key={point}
            onClick={() => onSelectPoint(point)}
            disabled={sessionStatus !== SESSION_STATUS.ACTIVE}
            className={`w-16 h-20 rounded-lg border-2 font-bold text-xl transition-all ${
              sessionStatus !== SESSION_STATUS.ACTIVE ? 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-50' : 
              selectedPoint === point ? 'bg-blue-600 border-blue-400 transform scale-105' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
            }`}
          >
            {point}
          </button>
        ))}
      </div>
    </div>
  );
}