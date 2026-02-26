export function registerConnectionHandler(io, socket, rooms) {
  socket.on('disconnect', () => {
    // Find and clean up player from any room they were in
    for (const [code, room] of rooms) {
      const player = room.removePlayer(socket.id);
      if (player) {
        io.to(code).emit('room:playerLeft', {
          playerId: player.id,
          playerName: player.name,
        });
        io.to(code).emit('room:playerList', {
          players: room.getPlayerList(),
        });
        console.log(`Player ${player.name} disconnected from room ${code}`);
      }

      // If display disconnected, clear it
      if (room.displaySocketId === socket.id) {
        room.displaySocketId = null;
      }

      // Clean up empty rooms (no players and no display)
      if (room.players.size === 0 && !room.displaySocketId) {
        if (room.timerInterval) clearInterval(room.timerInterval);
        rooms.delete(code);
        console.log(`Room ${code} deleted (empty)`);
      }
    }
  });
}
