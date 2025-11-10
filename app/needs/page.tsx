"use client";
import React, { useEffect, useMemo, useState, FC } from "react";
import { Need } from "../types";
import { NeedCard } from "../comp/NeedCard";
import { useUser } from "../context/UserContext";
import BackButton from "../comp/BackButton";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import UserRoute from "../comp/UserRoute";

const NeedsPanel: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [needs, setNeeds] = useState<Need[]>([]); //data of all the needs
  const [basketNeedIDs, setBasketNeedIDs] = useState<number[]>([]); //ids of needs in all the user's baskets
  const { currentUser } = useUser(); //user context
  useEffect(() => {
    //triggers on reder
    const fetchNeeds = async () => {
      try {
        const response = await fetch(
          "/api/needs?userID=" + (currentUser?.id || "")
        ); // endp requires user's ID for params
        if (response.ok) {
          const data = await response.json();
          setNeeds(data.needs || []); // set needs data
          setBasketNeedIDs(data.basketNeedIDs || []); // set basket need IDs
        } else {
          console.error("Failed to fetch needs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching needs:", error);
      }
    };
    fetchNeeds();
  }, [currentUser]); // current user is a dependancy

  const filtered = useMemo(() => {
    // memoization in order to avoid unnecessary recalc unless there are changes in deps.
    const term = searchTerm.trim().toLowerCase();
    if (!term) return needs;
    return needs.filter((n) => {
      return (
        n.title.toLowerCase().includes(term) ||
        n.description.toLowerCase().includes(term) ||
        n.category.toLowerCase().includes(term)
      );
    }); // logic to filter based on search
  }, [needs, searchTerm]);

  return (
    <UserRoute>

    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 py-8">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
          <div className="flex justify-center">
            <h1 className="text-4xl font-extrabold notable-regular">
              Needs Dashboard
            </h1>
          </div>

          <Link
            className="bg-green-500 text-2xl cursor-pointer p-4 flex rounded-2xl items-center justify-center notable-regular hover:scale-105 transition-transform"
            href="/basket"
          >
            <ArchiveBoxIcon className="h-9 w-9 mt-1 text-white" />
            <p className="text-white mx-4">Basket</p>
          </Link>

          <div className="flex justify-end">
            <input
              aria-label="Search needs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description or category"
              className="w-full sm:w-80 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((need) => (
            <NeedCard
              key={need.id}
              need={need}
              addedToBasket={basketNeedIDs.includes(need.id)} // checks if the need is already in the basket
              userID={currentUser?.id || 0}
              onBasketChange={(needId: number, added: boolean) => {
                setBasketNeedIDs((prev) => {
                  if (added) {
                    if (prev.includes(needId)) return prev;
                    return [...prev, needId];
                  } else {
                    return prev.filter((id) => id !== needId);
                  }
                });
              }}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No needs match your search.
          </div>
        )}
      </main>
    </div>
    </UserRoute>
  );
};

export default NeedsPanel;
