"use client";

import { useState } from "react";
//   import RegisterForm from "@/components/RegisterForm";
// import ChatRoom from "@/components/ChatRoom";
// import { User } from "@/types";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ChatRoom from "./components/ChatRoom";
import { User } from "./types";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loginDetail, setLoginDetail] = useState<any | null>({});

  const handleLoginSuccess = (jwt?: string, userData?: User, msg?: string) => {
    const token:any = jwt !=="" ? jwt: null;
    setToken(token);
    const userName:any = jwt !=="" && Object.keys(userData || {}).length > 0 ? userData : null;
    setUser(userName);
    const userNames:any = jwt ==="" && Object.keys(userData || {}).length > 0 ? userData : null;
    setLoginDetail(msg === "username or email already exists" ? { msg, user: userNames } : null);
    setMsg(msg || null);
  };

  return (
    <main className="w-full items-center justify-center p-4">
      { (!token || !user) && msg !== "username or email already exists" ? (
        <RegisterForm onLoginSuccess={handleLoginSuccess} />
      ) : msg === "username or email already exists" ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} loginDetail={loginDetail} />
      ) : (
        <ChatRoom token={token!} user={user!} />
      )}
    </main>
  );
}