import { generateLevel } from './levelGenerator.js';
import { normalizeWord } from './util/normalize.js';
import { STATUS_START, STATUS_GAME, STATUS_END } from './util/constants.js';

export async function loadNewLevel(room, io) {
  room.isLoading = true;
  room.isPaused = false;
  room.lastHit = null;

  io.to(room.code).emit('game:loading', { isLoading: true });

  try {
    const level = await generateLevel(room.language);
    room.words = level.words;
    room.currentTheme = level.theme;
    room.timeLeft = room.duration;
    room.roundNumber++;
    room.resetRoundScores();

    io.to(room.code).emit('game:newLevel', {
      theme: room.currentTheme,
      words: room.words,
      timeLeft: room.timeLeft,
      roundNumber: room.roundNumber,
      playerScores: room.getPlayerScores(),
    });
  } catch (err) {
    console.error('Failed to generate level:', err);
    // Retry after delay
    setTimeout(() => loadNewLevel(room, io), 2000);
  } finally {
    room.isLoading = false;
    io.to(room.code).emit('game:loading', { isLoading: false });
  }
}

export function startTimer(room, io) {
  stopTimer(room);

  room.timerInterval = setInterval(() => {
    if (room.isPaused || room.isLoading) return;

    room.timeLeft--;
    io.to(room.code).emit('game:tick', { timeLeft: room.timeLeft });

    if (room.timeLeft <= 0) {
      stopTimer(room);

      // Check round-based end condition before loading the next level
      if (checkEndCondition(room)) {
        room.status = STATUS_END;
        io.to(room.code).emit('game:ended', {
          status: STATUS_END,
          finalScores: room.getPlayerScores(),
        });
        return;
      }

      loadNewLevel(room, io).then(() => startTimer(room, io));
    }
  }, 1000);
}

export function stopTimer(room) {
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
}

export function processGuess(room, socketId, guess) {
  if (room.isLoading || room.status !== STATUS_GAME) {
    return { hit: false };
  }

  const normalized = normalizeWord(guess);
  const player = room.getPlayer(socketId);
  if (!player) return { hit: false };

  for (let i = 0; i < room.words.length; i++) {
    const word = room.words[i];
    if (!word.isRevealed && word.word === normalized) {
      word.isRevealed = true;
      word.revealedBy = player.name;

      player.roundScore++;
      player.totalScore++;

      room.lastHit = {
        username: player.name.toUpperCase(),
        word: normalized,
        index: i + 1,
      };

      const allRevealed = room.words.every((w) => w.isRevealed);

      return {
        hit: true,
        word: normalized,
        wordIndex: i,
        revealedBy: player.name,
        playerScores: room.getPlayerScores(),
        levelComplete: allRevealed,
        lastHit: room.lastHit,
      };
    }
  }

  return { hit: false };
}

export function checkEndCondition(room) {
  if (room.endMode === 1) return false; // Infinite

  if (room.endMode === 2) {
    // Round target
    return room.roundNumber >= room.endTarget;
  }

  if (room.endMode === 3) {
    // Score target
    for (const [, player] of room.players) {
      if (player.totalScore >= room.endTarget) return true;
    }
  }

  return false;
}
