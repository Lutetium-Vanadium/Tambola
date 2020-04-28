import io from "socket.io-client";

const socket = io();

socket.on("hello", console.log);

export default socket;
