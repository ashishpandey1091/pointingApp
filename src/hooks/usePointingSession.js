import { useState } from "react";
import { USER_ROLES, SESSION_STATUS } from "../models/types";

export default function usePointingSession() {
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(SESSION_STATUS.WAITING);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [pointValues] = useState([0.5, 1, 2, 3, 5, 8, 13]);

  const handleJoin = (name, isObserver) => {
    if (!name.trim()) return;

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      role: isObserver ? USER_ROLES.OBSERVER : USER_ROLES.VOTER,
      vote: null,
    };

    // Check if there's already an observer
    if (
      isObserver &&
      participants.some((p) => p.role === USER_ROLES.OBSERVER)
    ) {
      return { success: false, message: "An observer already exists" };
    }

    setParticipants([...participants, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const startSession = () => {
    if (currentUser?.role !== USER_ROLES.OBSERVER) return false;

    // Reset votes for all participants
    const resetParticipants = participants.map((p) => ({
      ...p,
      vote: null,
    }));

    setParticipants(resetParticipants);
    setSessionStatus(SESSION_STATUS.ACTIVE);
    setSelectedPoint(null);
    return true;
  };

  const endSession = () => {
    if (currentUser?.role !== USER_ROLES.OBSERVER) return false;
    setSessionStatus(SESSION_STATUS.REVEALED);
    return true;
  };

  const selectPoint = (point) => {
    if (
      sessionStatus !== SESSION_STATUS.ACTIVE ||
      !currentUser ||
      currentUser.role === USER_ROLES.OBSERVER
    )
      return false;

    setSelectedPoint(point);

    // Update user's vote
    const updatedParticipants = participants.map((p) =>
      p.id === currentUser.id ? { ...p, vote: point } : p
    );

    setParticipants(updatedParticipants);

    // Also update currentUser
    setCurrentUser({ ...currentUser, vote: point });
    return true;
  };

  const getVoteSummary = () => {
    if (sessionStatus !== SESSION_STATUS.REVEALED) return [];

    const summary = {};
    participants.forEach((p) => {
      if (p.vote !== null && p.role === USER_ROLES.VOTER) {
        summary[p.vote] = (summary[p.vote] || 0) + 1;
      }
    });

    return Object.entries(summary)
      .map(([point, count]) => ({
        point: parseFloat(point),
        count,
      }))
      .sort((a, b) => a.point - b.point);
  };

  const getAverageVote = () => {
    const voters = participants.filter(
      (p) => p.vote !== null && p.role === USER_ROLES.VOTER
    );
    if (voters.length === 0) return 0;

    const sum = voters.reduce((total, p) => total + p.vote, 0);
    return (sum / voters.length).toFixed(1);
  };

  const getVotingStatus = () => {
    if (sessionStatus !== SESSION_STATUS.ACTIVE) return "";

    const totalVoters = participants.filter(
      (p) => p.role === USER_ROLES.VOTER
    ).length;
    const votedCount = participants.filter(
      (p) => p.vote !== null && p.role === USER_ROLES.VOTER
    ).length;

    return `${votedCount} out of ${totalVoters} voted`;
  };

  return {
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
    SESSION_STATUS,
    USER_ROLES,
  };
}
