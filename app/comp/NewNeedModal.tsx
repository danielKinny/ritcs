"use client";
import React, { useEffect, useState } from "react";
import type { Need } from "../types";

type Priority = Need["priority"];

interface NewNeedModalProps {
  adminID?: number;
  need?: Need;
  onClose: () => void;
  onCreated: () => void;
}

const NewNeedModal: React.FC<NewNeedModalProps> = ({ adminID, need, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [timeSensitive, setTimeSensitive] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [amountNeeded, setAmountNeeded] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("medium");
    setTimeSensitive(false);
    setContactInfo("");
    setAmountNeeded(0);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminID && !need) {
      setError("Missing admin ID. Please log in again.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (amountNeeded <= 0) {
      setError("Amount needed must be greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = Boolean(need?.id);
      const payload = {
        need: {
          id: need?.id as number | undefined,
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          priority,
          timeSensitive,
          contactInfo: contactInfo.trim(),
          amountDonated: isEdit ? need!.amountDonated : 0,
          amountNeeded,
          adminID: isEdit ? need!.adminID : (adminID as number),
        } as Need,
      } as { need: Need };

      await fetch("/api/cupboard", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      reset();
      onCreated();
    } catch (err) {
      setError("something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (need) {
      setTitle(need.title || "");
      setDescription(need.description || "");
      setCategory(need.category || "");
      setPriority((need.priority as Priority) || "medium");
      setTimeSensitive(Boolean(need.timeSensitive));
      setContactInfo(need.contactInfo || "");
      setAmountNeeded(need.amountNeeded || 0);
    }
  }, [need]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{need ? "Edit Need" : "Create New Need"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                type="text"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Priority</label>
              <select
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Contact Info</label>
              <input
                type="text"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Amount Needed</label>
            <div className="mt-1 rounded border border-gray-300 bg-white p-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full rounded px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amountNeeded}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9.]/g, "");
                  setAmountNeeded(cleaned ? Number(cleaned) : 0);
                }}
                required
                aria-label="Amount needed"
              />
            </div>
          </div>
          

          <div className="flex items-center gap-2">
            <input
              id="timeSensitive"
              type="checkbox"
              checked={timeSensitive}
              onChange={(e) => setTimeSensitive(e.target.checked)}
            />
            <label htmlFor="timeSensitive" className="text-sm">Time sensitive</label>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (!adminID && !need)}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? (need ? "Updating..." : "Creating...") : (need ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewNeedModal;
