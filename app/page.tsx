"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./context/UserContext";

export default function Home() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const { setUser } = useUser();
  
  const authenticateUser = async (username: string, password: string) => {
    try {
      await setUser(username, password);
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage("Invalid username or password");
    }
  }
  return (
    <div className="min-h-screen bg-white text-center justify-center items-center bg-[url('/background.png')] bg-no-repeat bg-cover flex ">

      <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-gray-100 p-10 shadow-lg">
        <h1 className="font-extrabold text-5xl text-blue-800 notable-regular">NEEDS CONNECT</h1>
        <div className="flex flex-col gap-4 mt-6">
        <p className="text-red-500">
          {errorMessage}
        </p>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="p-2 border-gray-800 w-100 rounded-lg border text-black hover:scale-102 transition-transform"
          placeholder="Enter username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border-gray-800 w-100 rounded-lg border text-black hover:scale-102 transition-transform"
          placeholder="Enter password"
        />

        <button
          className="bg-blue-500 notable-regular hover:scale-105 h-15 transition-transform text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600 "
          onClick={() => {
            authenticateUser(userName, password);
          }}
        >
          Login
        </button>

      </div>
      </div>

      
    </div>
  );
}
