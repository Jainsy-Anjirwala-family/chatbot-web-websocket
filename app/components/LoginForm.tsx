'use client';

import { useEffect, useState } from 'react';
import { User } from '../types';

interface Props {
  onLoginSuccess: (token: string, user: User,msg?:string) => void;
}

export default function LoginForm({ onLoginSuccess, loginDetail }: Props & { loginDetail?: any }) {
  const [formData, setFormData] = useState({email: "", password: "" });
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if(loginDetail && ![undefined,null,""].includes(loginDetail?.user?.email) && ![undefined,null,""].includes(loginDetail?.user?.password)){
        setFormData({ email: loginDetail.user.email, password: loginDetail.user.password });
    } else{
        setFormData({ email: "", password: "" });
    }
    }, [loginDetail]);
  const emitDataToRegister = async (e: any) => {
     e.preventDefault();
     const user:any = {};
    onLoginSuccess("", user,"create new user")
  }
  const handleLogin = async (e: React.FormEvent) => {
     e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Add a minimum delay to show the loading animation for better UX
      const minDelay = new Promise(resolve => setTimeout(resolve, 800));

      const fetchPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/existing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const [res] = await Promise.all([fetchPromise, minDelay]);
      const data:any = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to login");

      onLoginSuccess(data.token, data.user, data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {/* Add your input fields and submit button here */}
      <input type="email" placeholder="Email" 
                  value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="password" placeholder="Password"
                  value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
      <button type="submit" disabled={loading}>Log In</button>
    </form>


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-600/30 blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10 mx-4">
        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden relative">

          {/* Decorative shine */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2 tracking-tight">
              Join Us
            </h2>
            <p className="text-gray-400 text-sm font-medium">Log in to your account to get started</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl animate-pulse text-center font-medium backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">

              {/* Email Input */}
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  required
                  className="block px-4 pb-2.5 pt-4 w-full text-sm text-white bg-white/5 rounded-xl border border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-purple-400 peer transition-all duration-300 focus:bg-white/10 hover:border-white/20"
                  placeholder=" "
                  value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-focus:text-purple-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 pointer-events-none"
                >
                  Email Address
                </label>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <input
                  type="password"
                  id="password"
                  required
                  className="block px-4 pb-2.5 pt-4 w-full text-sm text-white bg-white/5 rounded-xl border border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-purple-400 peer transition-all duration-300 focus:bg-white/10 hover:border-white/20"
                  placeholder=" "
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-focus:text-purple-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 pointer-events-none"
                >
                  Password
                </label>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 mt-8"
            >
              <div className="relative rounded-xl bg-slate-900/50 group-hover:bg-transparent transition-colors duration-300 h-full w-full">
                <span className="relative block px-8 py-3.5 text-sm font-bold text-white uppercase tracking-wider text-center">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="animate-pulse">Logging in...</span>
                    </div>
                  ) : (
                    "Log In"
                  )}
                </span>
              </div>
            </button>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                if you want to create  account? <span className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors" onClick={(e:any) => emitDataToRegister(e)}>Sign up</span>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500/50 text-xs mt-8">
          &copy; {new Date().getFullYear()} My Realtime Client. All rights reserved.
        </p>
      </div>
    </div>
  );
}