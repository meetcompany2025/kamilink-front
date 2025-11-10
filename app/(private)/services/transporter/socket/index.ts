// services/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // or your backend URL

export default socket;
