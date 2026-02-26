import { Room } from '../room.js';
import { generateUniqueRoomCode } from '../util/roomCodes.js';

export function registerDisplayHandler(io, socket, rooms) {
  // Display creates a room (no owner yet — first mobile user to join becomes owner)
  socket.on('display:createRoom', ({ language }) => {
    const code = generateUniqueRoomCode(new Set(rooms.keys()));
    const room = new Room(code);

    if (language) room.language = language;

    room.displaySocketId = socket.id;
    rooms.set(code, room);
    socket.join(code);

    console.log(`Room ${code} created from display`);

    socket.emit('display:roomCreated', { roomCode: code });
  });

  socket.on('display:register', ({ roomCode }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit('room:error', { message: 'Room not found' });
      return;
    }

    room.displaySocketId = socket.id;
    socket.join(roomCode);

    console.log(`Display registered for room ${roomCode}`);

    // Send full current state to the display
    socket.emit('display:stateUpdate', room.getState());
  });
}
