import { useState, useEffect, useCallback, useRef } from "react";
import { SESSION_STATUS, USER_ROLES } from "../models/types";
const POINT_VALUES = ["1", "2", "3", "5", "8", "13", "21", "?"];

// Helper for storing session data in localStorage
const sessionStorage = {
  save: (sessionId, data) => {
    localStorage.setItem(`pointing-session-${sessionId}`, JSON.stringify(data));
  },
  load: (sessionId) => {
    const data = localStorage.getItem(`pointing-session-${sessionId}`);
    return data ? JSON.parse(data) : null;
  },
};

function usePointingSession() {
  // State
  const [sessionId, setSessionId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(SESSION_STATUS.WAITING);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [pointValues] = useState(POINT_VALUES);

  // BroadcastChannel reference - for cross-tab communication
  const channelRef = useRef(null);

  // Setup/cleanup BroadcastChannel when sessionId changes
  useEffect(() => {
    if (!sessionId) return;

    // Create or join the channel for this session
    const channel = new BroadcastChannel(`pointing-session-${sessionId}`);
    channelRef.current = channel;

    // Listen for session updates
    channel.onmessage = (event) => {
      const { type, data } = event.data;

      switch (type) {
        case "SESSION_UPDATE":
          // Update local state with the received session state
          setSessionStatus(data.status);
          setParticipants(data.participants);

          // Also update in localStorage
          sessionStorage.save(sessionId, data);
          break;

        case "JOIN_REQUEST":
          // Only the observer should handle join requests
          if (currentUser?.role === USER_ROLES.OBSERVER) {
            const newUser = { ...data.user, vote: null };
            const updatedParticipants = [...participants, newUser];

            // Update state
            setParticipants(updatedParticipants);

            // Broadcast updated session state
            const sessionState = {
              status: sessionStatus,
              participants: updatedParticipants,
            };

            channel.postMessage({
              type: "SESSION_UPDATE",
              data: sessionState,
            });

            // Save to localStorage
            sessionStorage.save(sessionId, sessionState);
          }
          break;

        case "LEAVE_SESSION":
          // Only the observer should handle leave requests
          if (currentUser?.role === USER_ROLES.OBSERVER) {
            const updatedParticipants = participants.filter(
              (p) => p.id !== data.userId
            );

            // Update state
            setParticipants(updatedParticipants);

            // Broadcast updated session state
            const sessionState = {
              status: sessionStatus,
              participants: updatedParticipants,
            };

            channel.postMessage({
              type: "SESSION_UPDATE",
              data: sessionState,
            });

            // Save to localStorage
            sessionStorage.save(sessionId, sessionState);
          }
          break;

        case "SUBMIT_VOTE":
          // Only the observer should update votes
          if (currentUser?.role === USER_ROLES.OBSERVER) {
            const updatedParticipants = participants.map((p) =>
              p.id === data.userId ? { ...p, vote: data.vote } : p
            );

            // Update state
            setParticipants(updatedParticipants);

            // Broadcast updated session state
            const sessionState = {
              status: sessionStatus,
              participants: updatedParticipants,
            };

            channel.postMessage({
              type: "SESSION_UPDATE",
              data: sessionState,
            });

            // Save to localStorage
            sessionStorage.save(sessionId, sessionState);
          }
          break;

        case "SESSION_ACTION":
          // Only the observer should update session status
          if (currentUser?.role === USER_ROLES.OBSERVER) {
            let newStatus = sessionStatus;
            let updatedParticipants = [...participants];

            if (data.action === "START") {
              newStatus = SESSION_STATUS.ACTIVE;
              // Reset all votes
              updatedParticipants = participants.map((p) => ({
                ...p,
                vote: null,
              }));
            } else if (data.action === "END") {
              newStatus = SESSION_STATUS.REVEALED;
            }

            // Update state
            setSessionStatus(newStatus);
            setParticipants(updatedParticipants);

            // Broadcast updated session state
            const sessionState = {
              status: newStatus,
              participants: updatedParticipants,
            };

            channel.postMessage({
              type: "SESSION_UPDATE",
              data: sessionState,
            });

            // Save to localStorage
            sessionStorage.save(sessionId, sessionState);
          }
          break;
      }
    };

    // Clean up function
    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, [sessionId, currentUser, participants, sessionStatus]);

  // Create a new session
  const createSession = useCallback(() => {
    const newSessionId = Math.random().toString(36).substring(2, 9);
    console.log("Creating session:", newSessionId);
    return newSessionId;
  }, []);

  // Join a session
  const joinSession = useCallback(
    (sessionIdToJoin, userName, isObserver = false) => {
      const role = isObserver ? USER_ROLES.OBSERVER : USER_ROLES.VOTER;
      const userId = `user-${Math.random().toString(36).substring(2, 9)}`;

      const user = {
        id: userId,
        name: userName,
        role: role,
      };

      setSessionId(sessionIdToJoin);
      setCurrentUser(user);

      // Try to load existing session data from localStorage
      const existingSessionData = sessionStorage.load(sessionIdToJoin);

      if (isObserver) {
        // If creating as observer, initialize the session
        let initialParticipants = [user];
        let initialStatus = SESSION_STATUS.WAITING;

        if (existingSessionData) {
          // If session data exists, use it but add ourselves
          initialParticipants = [
            ...existingSessionData.participants.filter((p) => p.id !== userId),
            user,
          ];
          initialStatus = existingSessionData.status;
        }

        setParticipants(initialParticipants);
        setSessionStatus(initialStatus);

        // Save initial state
        const sessionState = {
          status: initialStatus,
          participants: initialParticipants,
        };

        sessionStorage.save(sessionIdToJoin, sessionState);

        // Broadcast the session state after channel is established
        setTimeout(() => {
          if (channelRef.current) {
            channelRef.current.postMessage({
              type: "SESSION_UPDATE",
              data: sessionState,
            });
          }
        }, 100);
      } else {
        // If joining as voter
        if (existingSessionData) {
          // Use the existing session data
          setParticipants(existingSessionData.participants);
          setSessionStatus(existingSessionData.status);
        }

        // Send join request after channel is established
        setTimeout(() => {
          if (channelRef.current) {
            channelRef.current.postMessage({
              type: "JOIN_REQUEST",
              data: { user },
            });
          }
        }, 100);
      }
    },
    []
  );

  const logout = useCallback(() => {
    if (sessionId && currentUser && channelRef.current) {
      // Send LEAVE_SESSION message via BroadcastChannel
      channelRef.current.postMessage({
        type: "LEAVE_SESSION",
        data: { userId: currentUser.id },
      });

      // Close BroadcastChannel
      channelRef.current.close();
      channelRef.current = null;
    }

    // Reset local state
    setSessionId(null);
    setCurrentUser(null);
    setParticipants([]);
    setSessionStatus(SESSION_STATUS.WAITING);
    setSelectedPoint(null);
  }, [sessionId, currentUser]);

  const startSession = useCallback(() => {
    if (currentUser?.role !== USER_ROLES.OBSERVER || !channelRef.current)
      return;

    // Reset all votes
    const updatedParticipants = participants.map((p) => ({ ...p, vote: null }));

    // Update local state
    setSessionStatus(SESSION_STATUS.ACTIVE);
    setParticipants(updatedParticipants);

    // Broadcast session action
    channelRef.current.postMessage({
      type: "SESSION_ACTION",
      data: {
        action: "START",
      },
    });

    // Save updated session state
    const sessionState = {
      status: SESSION_STATUS.ACTIVE,
      participants: updatedParticipants,
    };
    sessionStorage.save(sessionId, sessionState);
  }, [currentUser, participants, sessionId]);

  // End session and reveal results (observer only)
  const endSession = useCallback(() => {
    if (currentUser?.role !== USER_ROLES.OBSERVER || !channelRef.current)
      return;

    // Update local state
    setSessionStatus(SESSION_STATUS.REVEALED);

    // Broadcast session action
    channelRef.current.postMessage({
      type: "SESSION_ACTION",
      data: {
        action: "END",
      },
    });

    // Save updated session state
    const sessionState = {
      status: SESSION_STATUS.REVEALED,
      participants,
    };
    sessionStorage.save(sessionId, sessionState);
  }, [currentUser, participants, sessionId]);

  const selectPoint = useCallback(
    (point) => {
      if (
        currentUser?.role !== USER_ROLES.VOTER ||
        !sessionId ||
        !channelRef.current
      )
        return;

      setSelectedPoint(point);

      // Broadcast vote to observer
      channelRef.current.postMessage({
        type: "SUBMIT_VOTE",
        data: {
          userId: currentUser.id,
          vote: point,
        },
      });
    },
    [currentUser, sessionId]
  );

  // Get vote summary (for results display)
  const getVoteSummary = useCallback(() => {
    const summary = {};

    if (sessionStatus === SESSION_STATUS.REVEALED) {
      participants
        .filter((p) => p.role === USER_ROLES.VOTER && p.vote !== null)
        .forEach((voter) => {
          summary[voter.vote] = (summary[voter.vote] || 0) + 1;
        });
    }

    return summary;
  }, [participants, sessionStatus]);

  // Calculate average vote
  const getAverageVote = useCallback(() => {
    if (sessionStatus !== SESSION_STATUS.REVEALED) return null;

    const votes = participants
      .filter(
        (p) => p.role === USER_ROLES.VOTER && p.vote !== null && p.vote !== "?"
      )
      .map((v) => parseInt(v.vote, 10));

    if (votes.length === 0) return null;

    return (votes.reduce((sum, vote) => sum + vote, 0) / votes.length).toFixed(
      1
    );
  }, [participants, sessionStatus]);

  // Get current voting status (for status display)
  const getVotingStatus = useCallback(() => {
    if (sessionStatus !== SESSION_STATUS.ACTIVE) return null;

    const totalVoters = participants.filter(
      (p) => p.role === USER_ROLES.VOTER
    ).length;
    const votedCount = participants.filter(
      (p) => p.role === USER_ROLES.VOTER && p.vote !== null
    ).length;

    return {
      total: totalVoters,
      voted: votedCount,
      percentage:
        totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0,
    };
  }, [participants, sessionStatus]);

  return {
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
    SESSION_STATUS,
  };
}

export default usePointingSession;
