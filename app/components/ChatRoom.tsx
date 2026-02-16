"use client";

import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { initializeSocket } from "../lib/socket";
import { ChatMessage, User } from "../types";

interface Props {
  token: string;
  user: User;
}

export default function ChatRoom({ token, user }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSockets using our token
    const newSocket = initializeSocket(token);
    setSocket(newSocket);

    // Listen for incoming chat messages
    newSocket.on("chat:receive_message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for global system notifications (like NEW_USER)
    newSocket.on("system_notification", (data: { message: string }) => {
      setMessages((prev) => [
        ...prev,
        { username: "System", text: data.message, timestamp: new Date().toISOString(), isSystem: true },
      ]);
    });

    // Cleanup when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    // Send to backend
    socket.emit("chat:send_message", { text: input });

    // Optimistically add to our own UI
    setMessages((prev) => [
      ...prev,
      { username: user.username, text: input, timestamp: new Date().toISOString() },
    ]);
    setInput("");
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 relative overflow-hidden font-sans">
      {/* Background Gradients (Consistent with RegisterForm) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/15 blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-600/15 blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-4xl h-[85vh] relative z-10 p-4">
        {/* Glass Container */}
        <div className="flex flex-col h-full backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">

          {/* Header */}
          <header className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight tracking-wide">Global Chat</h2>
                <p className="text-xs text-green-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-white/10 rounded-full border border-white/5 text-xs text-gray-300">
                Logged in as <span className="text-purple-300 font-semibold">{user.username}</span>
              </div>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}

            {messages.map((msg, i) => {
              const isMe = msg.username === user.username;
              const isSystem = msg.isSystem;

              if (isSystem) {
                return (
                  <div key={i} className="flex justify-center my-4">
                    <span className="bg-white/10 text-gray-300 text-xs py-1 px-3 rounded-full border border-white/5 backdrop-blur-sm shadow-sm">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div key={i} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex-shrink-0 flex items-center justify-center text-xs text-white font-bold shadow-md border border-white/10">
                      {msg.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1 px-1">
                      <span className={`text-xs font-medium ${isMe ? 'text-purple-300' : 'text-gray-400'}`}>
                        {msg.username}
                      </span>
                      {msg.timestamp && <span className="text-[10px] text-gray-500">{formatTime(msg.timestamp)}</span>}
                    </div>

                    <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${isMe
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm'
                        : 'bg-white/10 text-gray-100 backdrop-blur-sm border border-white/5 rounded-tl-sm'
                      }`}>
                      {msg.text}
                    </div>
                  </div>

                  {isMe && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-xs text-white font-bold shadow-md border border-white/10">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
            <form onSubmit={sendMessage} className="relative flex items-center gap-3">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-slate-900/50 text-white placeholder-gray-500 border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all shadow-inner"
                />

                {/* Optional: Add emoji button inside input (visual only for now) */}
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
              </div>

              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Footer info (optional) */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 select-none">Press Enter to send</p>
        </div>
      </div>
    </div>
  );
}