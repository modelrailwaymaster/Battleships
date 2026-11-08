import { createServer } from "node:http";
import { Server } from "socket.io";

import { registerSocketHandlers } from "./socket.js";

const PORT = Number(process.env.PORT) || 3001;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: true,
  },
});

registerSocketHandlers(io);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Battleships server running on port ${PORT}`);
});
