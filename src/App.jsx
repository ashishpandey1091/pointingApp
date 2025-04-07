import React from 'react';
import JoinForm from './components/JoinForm';
import ObserverControls from './components/ObserverControls';
import StatusBar from './components/StatusBar';
import PointingCards from './components/PointingCards';
import ParticipantsList from './components/ParticipantsList';
import ResultsView from './components/ResultsView';
import usePointingSession from './hooks/usePointingSession';
import { USER_ROLES, SESSION_STATUS } from './models/types';
import './styles/index.css';

function App() {
  const {
    participants,
    currentUser,
    sessionStatus,
    selectedPoint,
    pointValues,
    handleJoin,
    startSession,
    endSession,
    selectPoint,
    getVoteSummary,
    getAverageVote,
    getVotingStatus,
    USER_ROLES,
    SESSION_STATUS
  } = usePointingSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Team Pointing App</h1>
        
        {/* Join Form */}
        {!currentUser && <JoinForm onJoin={handleJoin} />}
        
        {/* Main App */}
        {currentUser && (
          <div className="space-y-8">
            {/* Observer Controls */}
            {currentUser.role === USER_ROLES.OBSERVER && (
              <ObserverControls 
                sessionStatus={sessionStatus} 
                onStart={startSession} 
                onEnd={endSession} 
              />
            )}
            
            {/* Status Bar */}
            <StatusBar 
              currentUser={currentUser} 
              sessionStatus={sessionStatus} 
              votingStatus={getVotingStatus()} 
            />
            
            {/* Pointing Deck */}
            {currentUser.role === USER_ROLES.VOTER && (
              <PointingCards 
                sessionStatus={sessionStatus} 
                pointValues={pointValues} 
                selectedPoint={selectedPoint} 
                onSelectPoint={selectPoint} 
              />
            )}
            
            {/* Participants */}
            <ParticipantsList 
              participants={participants} 
              sessionStatus={sessionStatus} 
            />
            
            {/* Results */}
            {sessionStatus === SESSION_STATUS.REVEALED && (
              <ResultsView 
                voteSummary={getVoteSummary()} 
                averageVote={getAverageVote()} 
                voterCount={participants.filter(p => p.role === USER_ROLES.VOTER).length} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;