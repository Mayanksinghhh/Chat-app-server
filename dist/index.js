"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 3000 });
const allSockets = [];
wss.on('connection', function connection(socket) {
    socket.on('error', console.error);
    console.log('--:>connected');
    socket.on('message', function message(data) {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'join') {
            allSockets.push({
                socket,
                room: parsedData.payload.roomId
            });
        }
        if (parsedData.type === 'chat') {
            const currentUserRoom = allSockets.find((x) => x.socket == socket).room;
            allSockets.forEach((x) => {
                if (x.room === currentUserRoom) {
                    x.socket.send(JSON.stringify(parsedData.payload.message));
                }
            });
        }
        if (parsedData.type === 'typing') {
            const currentUserRoom = allSockets.find((x) => x.socket == socket).room;
            allSockets.forEach((x) => {
                if (x.room === currentUserRoom) {
                    x.socket.send(JSON.stringify(parsedData.payload.isTyping));
                    console.log(JSON.stringify(parsedData.payload.isTyping));
                }
            });
        }
    });
});
