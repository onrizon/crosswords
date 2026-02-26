import { DEFAULT_DURATION, STATUS_START } from './util/constants.js';

export class Room {
  constructor(code, ownerId = null, ownerName = null, authMode = 'anonymous') {
    // Identity
    this.code = code;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.authMode = authMode;

    // Settings
    this.language = 'pt';
    this.duration = DEFAULT_DURATION;
    this.endMode = 1;      // 1=infinite, 2=round target, 3=score target
    this.endTarget = 3;

    // State
    this.status = STATUS_START;
    this.players = new Map();
    this.displaySocketId = null;

    // Game
    this.currentTheme = '';
    this.words = [];
    this.timeLeft = DEFAULT_DURATION;
    this.timerInterval = null;
    this.isLoading = false;
    this.isPaused = false;
    this.roundNumber = 0;
    this.lastHit = null;
  }

  addPlayer(socketId, playerName, provider = null) {
    const player = {
      id: socketId,
      name: playerName,
      provider,
      roundScore: 0,
      totalScore: 0,
      joinedAt: Date.now(),
    };
    this.players.set(socketId, player);
    return player;
  }

  removePlayer(socketId) {
    const player = this.players.get(socketId);
    this.players.delete(socketId);
    return player;
  }

  getPlayer(socketId) {
    return this.players.get(socketId);
  }

  getPlayerList() {
    return Array.from(this.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      provider: p.provider,
      roundScore: p.roundScore,
      totalScore: p.totalScore,
    }));
  }

  getPlayerScores() {
    const scores = {};
    for (const [, player] of this.players) {
      scores[player.name] = {
        round: player.roundScore,
        total: player.totalScore,
      };
    }
    return scores;
  }

  resetRoundScores() {
    for (const [, player] of this.players) {
      player.roundScore = 0;
    }
  }

  getState() {
    return {
      code: this.code,
      ownerId: this.ownerId,
      ownerName: this.ownerName,
      authMode: this.authMode,
      language: this.language,
      duration: this.duration,
      endMode: this.endMode,
      endTarget: this.endTarget,
      status: this.status,
      players: this.getPlayerList(),
      currentTheme: this.currentTheme,
      words: this.words,
      timeLeft: this.timeLeft,
      isLoading: this.isLoading,
      isPaused: this.isPaused,
      roundNumber: this.roundNumber,
      lastHit: this.lastHit,
      playerScores: this.getPlayerScores(),
    };
  }
}
