import React from 'react';

export default function ResultsView({ voteSummary, averageVote, voterCount }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Vote Distribution</h3>
          <div className="space-y-2">
            {voteSummary.map(item => (
              <div key={item.point} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
                  {item.point}
                </div>
                <div className="flex-1 h-6 bg-gray-700 rounded overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${(item.count / voterCount) * 100}%` }}
                  ></div>
                </div>
                <div className="w-10 text-right">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-48">
          <h3 className="text-lg font-medium mb-2">Average</h3>
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold mx-auto">
            {averageVote}
          </div>
        </div>
      </div>
    </div>
  );
}