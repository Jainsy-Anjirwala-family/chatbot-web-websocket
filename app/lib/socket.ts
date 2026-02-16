import { io, Socket } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://chatbot-backend-api-3l19.onrender.com";

export const initializeSocket = (token: string): Socket => {
  return io(BACKEND_URL, {
    auth: { token },
  });
};