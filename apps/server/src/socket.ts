import type { Server, Socket } from "socket.io";

import { RoomManager } from "./rooms/roomManager.js";

import type { PublicRoomState, ServerResponse } from "./types.js";

interface Acknowledgement {
  (
    response: ServerResponse & {
      room?: PublicRoomState;
      playerId?: string;
    },
  ): void;
}

const roomManager = new RoomManager();

export function registerSocketHandlers(io: Server): void {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // HOST: Create a room
    socket.on(
      "host:create",
      (payload: { hostName: string }, acknowledge: Acknowledgement) => {
        const hostName = payload.hostName?.trim();

        if (!hostName || hostName.length > 20) {
          acknowledge({
            success: false,
            message: "Please enter a name between 1 and 20 characters.",
          });
          return;
        }

        if (roomManager.findRoomBySocketId(socket.id)) {
          acknowledge({
            success: false,
            message: "You are already hosting or participating in a game.",
          });
          return;
        }

        const room = roomManager.createRoom(socket.id, hostName);

        socket.join(room.code);

        const state = room.getPublicState();

        acknowledge({
          success: true,
          room: state,
        });

        io.to(room.code).emit("room:updated", state);

        console.log(`Room ${room.code} created by ${hostName}`);
      },
    );

    // PLAYER: Join a room
    socket.on(
      "player:join",
      (
        payload: { roomCode: string; playerName: string },
        acknowledge: Acknowledgement,
      ) => {
        const roomCode = payload.roomCode?.trim().toUpperCase();
        const playerName = payload.playerName?.trim();

        if (!roomCode || !playerName || playerName.length > 20) {
          acknowledge({
            success: false,
            message: "Please enter a valid room code and player name.",
          });
          return;
        }

        if (roomManager.findRoomBySocketId(socket.id)) {
          acknowledge({
            success: false,
            message: "You are already hosting or participating in a game.",
          });
          return;
        }

        const room = roomManager.getRoom(roomCode);

        if (!room) {
          acknowledge({
            success: false,
            message: "Game not found.",
          });
          return;
        }

        if (room.locked || room.gameStage !== "lobby") {
          acknowledge({
            success: false,
            message: "This game is no longer accepting players.",
          });
          return;
        }

        room.addPlayer(socket.id, playerName);

        socket.join(room.code);

        const state = room.getPublicState();

        acknowledge({
          success: true,
          playerId: socket.id,
          room: state,
        });

        io.to(room.code).emit("room:updated", state);

        console.log(`${playerName} joined room ${room.code}`);
      },
    );

    // HOST: Lock or unlock the lobby
    socket.on(
      "host:set-locked",
      (payload: { locked: boolean }, acknowledge: Acknowledgement) => {
        const room = roomManager.findRoomBySocketId(socket.id);

        if (!room || room.hostSocketId !== socket.id) {
          acknowledge({
            success: false,
            message: "Only the host can change lobby settings.",
          });
          return;
        }

        if (room.gameStage !== "lobby") {
          acknowledge({
            success: false,
            message: "The lobby can no longer be changed.",
          });
          return;
        }

        room.locked = payload.locked;

        io.to(room.code).emit("room:updated", room.getPublicState());

        acknowledge({ success: true });
      },
    );

    // HOST: Remove a player
    socket.on(
      "host:remove-player",
      (payload: { playerId: string }, acknowledge: Acknowledgement) => {
        const room = roomManager.findRoomBySocketId(socket.id);

        if (!room || room.hostSocketId !== socket.id) {
          acknowledge({
            success: false,
            message: "Only the host can remove players.",
          });
          return;
        }

        if (room.gameStage !== "lobby") {
          acknowledge({
            success: false,
            message: "Players cannot be removed at this stage.",
          });
          return;
        }

        const player = room.getPlayer(payload.playerId);

        if (!player) {
          acknowledge({
            success: false,
            message: "Player not found.",
          });
          return;
        }

        room.removePlayer(player.id);

        const playerSocket = io.sockets.sockets.get(player.id);

        playerSocket?.leave(room.code);
        playerSocket?.emit("player:removed", {
          message: "The host removed you from the game.",
        });

        io.to(room.code).emit("room:updated", room.getPublicState());

        acknowledge({ success: true });
      },
    );

    // PLAYER: Mark themselves as ready
    socket.on(
      "player:set-ready",
      (payload: { ready: boolean }, acknowledge: Acknowledgement) => {
        const room = roomManager.findRoomBySocketId(socket.id);

        if (!room || room.hostSocketId === socket.id) {
          acknowledge({
            success: false,
            message: "You are not a player in a game.",
          });
          return;
        }

        if (!(room.gameStage === "lobby" || room.gameStage === "placement")) {
          acknowledge({
            success: false,
            message:
              "Players can only mark themselves ready in the lobby or during placement.",
          });
          return;
        }

        if (!room.setPlayerReady(socket.id, payload.ready)) {
          acknowledge({
            success: false,
            message: "Player not found.",
          });
          return;
        }

        io.to(room.code).emit("room:updated", room.getPublicState());

        acknowledge({ success: true });
      },
    );

    // HOST: Start the actual game
    socket.on(
      "host:start-game",
      (_payload: undefined, acknowledge: Acknowledgement) => {
        const room = roomManager.findRoomBySocketId(socket.id);

        if (!room || room.hostSocketId !== socket.id) {
          acknowledge({
            success: false,
            message: "Only the host can start the game.",
          });
          return;
        }

        if (room.players.size < 2) {
          acknowledge({
            success: false,
            message: "Not enough players to start the game.",
          });
          return;
        }

        if (room.roomStage !== "lobby" || room.gameStage !== "lobby") {
          acknowledge({
            success: false,
            message: "The game can no longer be started.",
          });
          return;
        }

        if (!room.allPlayersReady()) {
          acknowledge({
            success: false,
            message: "Not everyone is ready yet.",
          });
          return;
        }

        room.roomStage = "playing";
        room.gameStage = "placement";

        room.locked = true;
        room.resetPlayerReady();

        io.to(room.code).emit("room:updated", room.getPublicState());

        acknowledge({ success: true });
      },
    );

    // HOST: Finishes the placement
    socket.on(
      "host:end-placement",
      (_payload: undefined, acknowledge: Acknowledgement) => {
        const room = roomManager.findRoomBySocketId(socket.id);

        if (!room || room.hostSocketId !== socket.id) {
          acknowledge({
            success: false,
            message: "Only the host can end the ship placement.",
          });
          return;
        }

        if (room.roomStage !== "playing" || room.gameStage !== "placement") {
          acknowledge({
            success: false,
            message: "The placement can no longer be ended.",
          });
          return;
        }

        if (!room.allPlayersReady()) {
          acknowledge({
            success: false,
            message: "Not everyone is ready yet.",
          });
          return;
        }

        room.gameStage = "playing";

        io.to(room.code).emit("room:updated", room.getPublicState());

        acknowledge({ success: true });
      },
    );

    // Handle disconnects
    socket.on("disconnect", () => {
      const room = roomManager.findRoomBySocketId(socket.id);

      if (!room) return;

      if (room.hostSocketId === socket.id) {
        io.to(room.code).emit("room:closed", {
          message: "The host disconnected. This game has closed.",
        });

        roomManager.deleteRoom(room.code);

        console.log(`Room ${room.code} closed`);
      } else {
        room.removePlayer(socket.id);

        io.to(room.code).emit("room:updated", room.getPublicState());

        console.log(`Player disconnected from room ${room.code}`);
      }

      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}
