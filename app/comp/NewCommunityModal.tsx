"use client";
import React, { FC, FormEvent, useState } from "react";
import type { CommunityItem } from "../types";

interface NewCommunityModalProps {
  onClose: () => void;
  onCreated: (item: CommunityItem) => void;
  adminID: number;
}

const categories: CommunityItem["category"][] = [
  "Food",
  "Clothing",
  "Shelter",
  "Medical",
  "Education",
  "Other",
];

const NewCommunityModal: FC<NewCommunityModalProps> = ({
  onClose,
  onCreated,
  adminID,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CommunityItem["category"]>("Other");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setSubmitting(true);
      const body = {
        title: title.trim(),
        description: description.trim(),
        category,
        adminID,
      };
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok || res.status === 201) {
        const created: CommunityItem = {
          id: Date.now(),
          title,
          description,
          category,
          adminID: 0,
          volunteersNeeded: 0,
          createdAt: new Date().toISOString(),
        };
        onCreated(created);
        // reset
        setTitle("");
        setDescription("");
        setCategory("Other");
      } else {
        setError("Failed to create community item.");
        // console.error("Failed to create community item", res.status);
      }
    } catch (err) {
      // console.error(err);
      void err;
      setError("Error creating community item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-lg p-6 w-full max-w-lg mx-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Create community post</h2>
          <button
            type="button"
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-2 py-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">
            Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border px-2 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full border px-2 py-2 rounded"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 cursor-pointer rounded border"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCommunityModal;
