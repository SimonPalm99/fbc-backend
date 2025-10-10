"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = setupSocket;
const socket_io_1 = require("socket.io");
function setupSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: ['https://fbc-nykoping-lagapp.vercel.app'],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
        });
        socket.on('chatMessage', (data) => {
            // data: { roomId, message, userId?, userName? }
            io.to(data.roomId).emit('chatMessage', data);
        });
        socket.on('typing', (roomId, userName) => {
            socket.to(roomId).emit('typing', userName);
        });
        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
}
