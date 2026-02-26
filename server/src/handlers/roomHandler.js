import { Room } from '../room.js';
import { generateUniqueRoomCode } from '../util/roomCodes.js';

export function registerRoomHandler(io, socket, rooms) {
  socket.on('room:create', ({ playerName, authMode, language }) => {
    const code = generateUniqueRoomCode(new Set(rooms.keys()));
    const room = new Room(code, socket.id, playerName, authMode || 'anonymous');

    if (language) room.language = language;

    rooms.set(code, room);

    socket.join(code);

    const player = room.addPlayer(socket.id, playerName);

    console.log(`Room ${code} created by ${playerName}`);

    socket.emit('room:created', {
      roomCode: code,
      roomState: room.getState(),
      playerId: player.id,
    });

    io.to(code).emit('room:playerList', {
      players: room.getPlayerList(),
    });
  });

  socket.on('room:join', ({ roomCode, playerName, provider }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit('room:error', { message: 'Room not found' });
      return;
    }

    // First player to join an ownerless room becomes the owner
    const becameOwner = !room.ownerId;
    if (becameOwner) {
      room.ownerId = socket.id;
      room.ownerName = playerName;
      // Owner's provider sets the room's authMode
      if (provider === 'twitch') room.authMode = 'twitch';
      else if (provider === 'discord') room.authMode = 'discord';
      else room.authMode = 'anonymous';
      console.log(`${playerName} became owner of room ${roomCode} (authMode: ${room.authMode})`);
    }

    // Enforce authMode for non-owner joins
    if (!becameOwner && room.authMode !== 'anonymous') {
      if (room.authMode !== provider) {
        const platform = room.authMode === 'twitch' ? 'Twitch' : 'Discord';
        socket.emit('room:error', { message: `This room requires ${platform} login` });
        return;
      }
    }

    // Check for duplicate names
    const existingNames = Array.from(room.players.values()).map((p) => p.name.toLowerCase());
    if (existingNames.includes(playerName.toLowerCase())) {
      socket.emit('room:error', { message: 'Name already taken' });
      return;
    }

    socket.join(roomCode);
    const player = room.addPlayer(socket.id, playerName, provider || null);

    console.log(`${playerName} joined room ${roomCode}`);

    socket.emit('room:joined', {
      roomState: room.getState(),
      playerId: player.id,
    });

    socket.to(roomCode).emit('room:playerJoined', { player });

    io.to(roomCode).emit('room:playerList', {
      players: room.getPlayerList(),
    });

    // Notify display that owner was assigned → display redirects to /system
    if (becameOwner && room.displaySocketId) {
      io.to(room.displaySocketId).emit('display:ownerAssigned', {
        roomCode,
        ownerId: room.ownerId,
        ownerName: room.ownerName,
      });
    }
  });

  // Get basic room info without joining (for the join page to know authMode)
  socket.on('room:getInfo', ({ roomCode }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit('room:error', { message: 'Room not found' });
      return;
    }

    socket.emit('room:info', {
      code: room.code,
      ownerName: room.ownerName,
      authMode: room.authMode,
      playerCount: room.players.size,
    });
  });

  socket.on('room:leave', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.removePlayer(socket.id);
    socket.leave(roomCode);

    if (player) {
      io.to(roomCode).emit('room:playerLeft', {
        playerId: player.id,
        playerName: player.name,
      });
      io.to(roomCode).emit('room:playerList', {
        players: room.getPlayerList(),
      });
    }
  });
}
