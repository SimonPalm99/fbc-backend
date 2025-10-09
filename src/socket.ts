
import { Server, Socket } from 'socket.io';
import http from 'http';
import express from 'express';

export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001', 'https://fbc-nykoping-lagapp.vercel.app'],
      credentials: true
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
    });

    socket.on('chatMessage', (data: { roomId: string; message: string; userId?: string; userName?: string }) => {
      // data: { roomId, message, userId?, userName? }
      io.to(data.roomId).emit('chatMessage', data);
    });

    socket.on('typing', (roomId: string, userName: string) => {
      socket.to(roomId).emit('typing', userName);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
}
