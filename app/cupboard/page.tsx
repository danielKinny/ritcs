"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Need } from "../types";
import { useUser } from "../context/UserContext";
import NewNeedModal from "../comp/NewNeedModal";
import AdminCard from "../comp/AdminCard";
import { toast } from "sonner";
import AdminRoute from "../comp/AdminRoute";

const CupboardPage = () => {
  const { currentUser } = useUser(); //user ctx
  const [needsCreated, setNeedsCreated] = useState<Need[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false); //modal for creating/editing needs
  const [editNeed, setEditNeed] = useState<Need | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  // single fetch function used for initial load, manual refresh, and callbacks
  const fetchNeeds = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
      setError("");
    }

    try {
      const url = currentUser?.id
        ? `/api/cupboard/?adminID=${currentUser.id}`
        : `/api/cupboard`;
      const res = await fetch(url);
      if (!res.ok) {
        const { message } = await res
          .json()
          .catch(() => ({ message: "Failed to load cupboard" }));
        throw new Error(message);
      }
      const data = await res.json();
      setNeedsCreated(
        (Array.isArray(data) ? data : []).filter(
          (need) => need.closed === null || need.closed === 0
        )
      );
    } catch (e: any) {
      // console.error("Failed to fetch needs:", e);
      setError(e?.message || "Something went wrong");
    } finally {
      if (refresh) setIsRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
    // intentionally empty deps: mirror previous behavior of loading once on mount
    // If you want to refetch when currentUser changes, add it to the deps array.
  }, []);

  const handleNeedCreated = async () => {
    setShowModal(false);
    toast.success("Need saved successfully");
    await fetchNeeds();
  }; // disables modal and refetches needs

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return needsCreated;
    return needsCreated.filter((n) =>
      [n.title, n.description, n.category].some((v) =>
        (v || "").toLowerCase().includes(term)
      )
    );
  }, [needsCreated, search]); // search filter logic

  const stats = useMemo(() => {
    const count = needsCreated.length;
    const high = needsCreated.filter((n) => n.priority === "high").length;
    const totalNeeded = Number(
      needsCreated.reduce((sum, n) => sum + (Number(n.amountNeeded) || 0), 0)
    );
    const totalDonated = Number(
      needsCreated.reduce((sum, n) => sum + (Number(n.amountDonated) || 0), 0)
    );
    return { count, high, totalNeeded, totalDonated };
  }, [needsCreated]); // stats that we are gunna be using for the cupboard
  //using react's memoization to avoid recalc unless deps. change

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 text-gray-900 px-6 py-8">
        <header className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold">My Cupboard</h1>
              <p className="text-sm text-gray-500">
                Manage the needs you’ve created
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                aria-label="Search my needs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, or category"
                className="w-full hover:scale-102 transition-transform sm:w-80 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={() => fetchNeeds(true)}
                className="px-4 cursor-pointer hover:bg-black hover:text-white py-2 rounded-md border transition-colors border-gray-300 text-gray-700"
              >
                {isRefreshing ? "Refreshing…" : "Refresh"}
              </button>
              <button
                onClick={() => {
                  setEditNeed(null);
                  setShowModal(true);
                }}
                className="cursor-pointer px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Create New Need
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="rounded-lg border p-4 bg-white">
              <div className="text-xs text-gray-500">Total needs created</div>
              <div className="text-xl font-semibold">{stats.count}</div>
            </div>
            <div className="rounded-lg border p-4 bg-white">
              <div className="text-xs text-gray-500">High priority</div>
              <div className="text-xl font-semibold text-red-600">
                {stats.high}
              </div>
            </div>
            <div className="rounded-lg border p-4 bg-white">
              <div className="text-xs text-gray-500">
                Total donations collected
              </div>
              <div className="text-xl font-semibold text-green-600">
                ${stats.totalDonated}
              </div>
            </div>
            <div className="rounded-lg border p-4 bg-white">
              <div className="text-xs text-gray-500">Goal total</div>
              <div className="text-xl font-semibold">${stats.totalNeeded}</div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          {loading && (
            <div className="rounded-lg border p-6 bg-white">Loading…</div>
          )}

          {!loading && error && (
            <div className="rounded-lg border p-6 bg-white text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {filtered.length === 0 ? (
                <div className="rounded-lg border p-8 bg-white text-center">
                  <div className="text-lg font-semibold">No needs yet</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Create your first need to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((need) => (
                    <AdminCard
                      key={need.id}
                      need={need}
                      adminID={currentUser?.id || 0}
                      onEdit={(n) => {
                        setEditNeed(n);
                        setShowModal(true);
                      }}
                      onDelete={() => fetchNeeds(true)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        {showModal && (
          <NewNeedModal
            adminID={currentUser?.id}
            need={editNeed ?? undefined}
            onClose={() => {
              setShowModal(false);
              setEditNeed(null);
            }}
            onCreated={handleNeedCreated}
          /> // react's beauty once again
        )}
      </div>
    </AdminRoute>
  );
};

export default CupboardPage;
