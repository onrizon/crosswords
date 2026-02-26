import { loadNewLevel, startTimer, stopTimer, processGuess, checkEndCondition } from '../game.js';
import { STATUS_START, STATUS_GAME, STATUS_END } from '../util/constants.js';

export function registerGameHandler(io, socket, rooms) {
  socket.on('game:updateSettings', ({ roomCode, duration, language, endMode, endTarget }) => {
    const room = rooms.get(roomCode);
    if (!room || room.ownerId !== socket.id) return;

    if (duration !== undefined) room.duration = duration;
    if (language !== undefined) room.language = language;
    if (endMode !== undefined) room.endMode = endMode;
    if (endTarget !== undefined) room.endTarget = endTarget;

    io.to(roomCode).emit('display:stateUpdate', {
      duration: room.duration,
      language: room.language,
      endMode: room.endMode,
      endTarget: room.endTarget,
    });
  });

  socket.on('game:start', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.ownerId !== socket.id) return;
    if (room.status === STATUS_GAME) return;

    room.status = STATUS_GAME;
    room.roundNumber = 0;

    io.to(roomCode).emit('game:started', { status: STATUS_GAME });

    loadNewLevel(room, io).then(() => {
      startTimer(room, io);
    });
  });

  socket.on('game:guess', ({ roomCode, word }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const result = processGuess(room, socket.id, word);

    // Always send result back to the guesser
    socket.emit('game:guessResult', {
      hit: result.hit,
      word: result.word || null,
      index: result.wordIndex !== undefined ? result.wordIndex : null,
    });

    if (result.hit) {
      // Broadcast word reveal to entire room
      io.to(roomCode).emit('game:wordRevealed', {
        wordIndex: result.wordIndex,
        revealedBy: result.revealedBy,
        playerScores: result.playerScores,
        lastHit: result.lastHit,
      });

      // Check points-based end condition after every hit
      if (room.endMode === 3 && checkEndCondition(room)) {
        stopTimer(room);
        room.status = STATUS_END;
        io.to(roomCode).emit('game:ended', {
          status: STATUS_END,
          finalScores: room.getPlayerScores(),
        });
        return;
      }

      if (result.levelComplete) {
        io.to(roomCode).emit('game:levelComplete', {});

        // Check round-based end condition
        if (checkEndCondition(room)) {
          stopTimer(room);
          room.status = STATUS_END;
          io.to(roomCode).emit('game:ended', {
            status: STATUS_END,
            finalScores: room.getPlayerScores(),
          });
          return;
        }

        // Load next level after a short delay
        stopTimer(room);
        setTimeout(() => {
          loadNewLevel(room, io).then(() => {
            startTimer(room, io);
          });
        }, 3000);
      }
    }
  });

  socket.on('game:pause', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.ownerId !== socket.id) return;

    room.isPaused = true;
    io.to(roomCode).emit('game:paused', {});
  });

  socket.on('game:resume', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.ownerId !== socket.id) return;

    room.isPaused = false;
    io.to(roomCode).emit('game:resumed', {});
  });

  socket.on('game:reset', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.ownerId !== socket.id) return;

    stopTimer(room);
    room.status = STATUS_START;
    room.roundNumber = 0;
    room.words = [];
    room.currentTheme = '';
    room.timeLeft = room.duration;
    room.isLoading = false;
    room.isPaused = false;
    room.lastHit = null;

    for (const [, player] of room.players) {
      player.roundScore = 0;
      player.totalScore = 0;
    }

    io.to(roomCode).emit('game:resetToStart', { status: STATUS_START });
  });

  socket.on('game:restart', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.ownerId !== socket.id) return;

    stopTimer(room);
    room.status = STATUS_GAME;
    room.roundNumber = 0;

    // Reset all scores
    for (const [, player] of room.players) {
      player.roundScore = 0;
      player.totalScore = 0;
    }

    io.to(roomCode).emit('game:started', { status: STATUS_GAME });

    loadNewLevel(room, io).then(() => {
      startTimer(room, io);
    });
  });
}
