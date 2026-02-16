"use client";

import { useState } from "react";
//   import RegisterForm from "@/components/RegisterForm";
// import ChatRoom from "@/components/ChatRoom";
// import { User } from "@/types";
import RegisterForm from "./components/RegisterForm";
import ChatRoom from "./components/ChatRoom";
import { User } from "./types";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (jwt: string, userData: User) => {
    setToken(jwt);
    setUser(userData);
  };

  return (
    <main className="w-full items-center justify-center p-4">
      {!token || !user ? (
        <RegisterForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChatRoom token={token} user={user} />
      )}
    </main>
  );
}