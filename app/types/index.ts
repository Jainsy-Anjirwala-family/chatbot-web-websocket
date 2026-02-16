export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ChatMessage {
  userId?: number;
  username: string;
  text: string;
  timestamp: string;
  isSystem?: boolean; // True if it's a notification from the server
}