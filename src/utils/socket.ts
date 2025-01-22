import { Socket, io } from "socket.io-client";

export const socket: Socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

console.log("create socket -----------------------");
