"use client";

import React, { useState, useEffect } from "react";
import CommunityCard from "../comp/CommunityCard";
import NewCommunityModal from "../comp/NewCommunityModal";
import { CommunityItem } from "../types";
import { useUser } from "../context/UserContext";
import Route from "../comp/Route";

const CommunityPage = () => {
  const { currentUser } = useUser();
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // modal form state moved into NewCommunityModal component

  useEffect(() => {
    const fetchCommunityItems = async () => {
      try {
        const res = await fetch("/api/community");
        if (res.ok) {
          const data = await res.json();
          setCommunityItems(data || []);
        } else {
          // console.error("Failed to load community items", res.status);
        }
      } catch (error) {
        // console.error("Error fetching community items:", error);
        void error;
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityItems();
  }, []);

  const filtered = communityItems.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  // Create logic is handled by NewCommunityModal; it will call onCreated

  return (
    <Route>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600 mt-1">
            Share announcements, requests, and resources with the community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 rounded-lg">
          <div className="flex-1">
            <input
              type="search"
              aria-label="Search community"
              placeholder="Search title, description or category"
              className="w-full border rounded px-3 py-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {currentUser?.role === "admin" && (
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowModal(true)}
              >
                New Post
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-600">
            No community posts found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((item) => (
              <CommunityCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {showModal && (
          <NewCommunityModal
            onClose={() => setShowModal(false)}
            onCreated={(created) => {
              setCommunityItems((prev) => [created, ...prev]);
              setShowModal(false);
            }}
            adminID={currentUser?.id || 0}
          />
        )}
      </div>
    </Route>
  );
};

export default CommunityPage;
