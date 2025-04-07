import React from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ObserverControls from './components/ObserverControls';
import StatusBar from './components/StatusBar';
import PointingCards from './components/PointingCards';
import ParticipantsList from './components/ParticipantsList';
import ResultsView from './components/ResultsView';
import SessionInfo from './components/SessionInfo';
import usePointingSession from './hooks/usePointingSession';
import { USER_ROLES } from './models/types';
import './styles/index.css';

function App() {
  const {
    sessionId,
    participants,
    currentUser,
    sessionStatus,
    selectedPoint,
    pointValues,
    createSession,
    joinSession,
    logout,
    startSession,
    endSession,
    selectPoint,
    getVoteSummary,
    getAverageVote,
    getVotingStatus,
    USER_ROLES,
    SESSION_STATUS
  } = usePointingSession();

  // Create a new session and join as observer
  const handleCreateSession = (name) => {
    const newSessionId = createSession();
    joinSession(newSessionId, name, true); // Join as observer
    return newSessionId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {currentUser ? (
          <>
            <Header 
              currentUser={currentUser} 
              sessionId={sessionId} 
              onLogout={logout}
            />
            
            {sessionId && <SessionInfo sessionId={sessionId} />}
            
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
          </>
        ) : (
          <LandingPage 
            onCreateSession={handleCreateSession}
            onJoinSession={joinSession}
          />
        )}
      </div>
    </div>
  );
}

export default App;