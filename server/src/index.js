import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env BEFORE any other imports that need env vars
dotenv.config({ path: resolve(__dirname, '../../app/.env.local') });

// Dynamic imports after env is loaded
const { createServer } = await import('http');
const { Server } = await import('socket.io');
const { registerConnectionHandler } = await import('./handlers/connectionHandler.js');
const { registerRoomHandler } = await import('./handlers/roomHandler.js');
const { registerGameHandler } = await import('./handlers/gameHandler.js');
const { registerDisplayHandler } = await import('./handlers/displayHandler.js');

const PORT = process.env.WS_PORT || 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://jogo.tv'],
    methods: ['GET', 'POST'],
  },
});

// In-memory room storage
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  registerConnectionHandler(io, socket, rooms);
  registerRoomHandler(io, socket, rooms);
  registerGameHandler(io, socket, rooms);
  registerDisplayHandler(io, socket, rooms);
});

httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
