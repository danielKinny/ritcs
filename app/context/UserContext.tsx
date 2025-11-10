"use client";
//ctx page (v.v.v.v.v important)
import React, { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";
import type { User } from "@/app/types";

interface authorisationContext {
  atoken?: string | null;
  currentUser?: User | null;
  setUser: (password: string, username: string) => Promise<void>;
  removeUser: () => Promise<void>;
}
//have to provide typing to satisfy ts

const UserContext = createContext<authorisationContext | undefined>(undefined); //react shenanigans
type props = PropsWithChildren<{
  initialUser?: User | null;
}>;

export function UserProvider({ children, initialUser = null }: props) {
  //atoken is used for auth
  const [atoken, setAtoken] = useState<string | null>(initialUser?.atoken ?? null);
  const [user, setUser] = useState<User | null>(initialUser ?? null);

  async function fetchUser(username: string, password: string): Promise<void> {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }); // calls login api
    if (!res.ok) {
      setUser(null);
      setAtoken(null);
      throw new Error("Failed to fetch user");
    } // if not okay, log evryything out

    const { message: resMessage, currentUser: user } : { message: string, currentUser: User } = await res.json();
    console.log("Login response message:", resMessage);
    setAtoken(user?.atoken || null);
    setUser(user); //logged in
  }

  async function removeUser(): Promise<void> {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      // ignore network errors and still clear client state
      console.error('Logout API call failed', e);
    }

    setUser(null);
    setAtoken(null);
    return; //logs out
  }

  return (
    <UserContext.Provider
      value={{
        atoken,
        currentUser: user,
        setUser: fetchUser,
        removeUser: removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  ); //wraps all child components with context
}

export function useUser() { //hook that can be used to access user context
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
