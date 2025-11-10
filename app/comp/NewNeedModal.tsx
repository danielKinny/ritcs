"use client";
import React, { FC, FormEvent, useEffect, useState } from "react";
import type { Need } from "../types";

type Priority = Need["priority"];

interface NewNeedModalProps {
  adminID?: number;
  need?: Need;
  onClose: () => void;
  onCreated: () => void;
}

const NewNeedModal: FC<NewNeedModalProps> = ({ adminID, need, onClose, onCreated }) => {
  const [form, setForm] = useState<{
    title: string;
    description: string;
    category: Need["category"];
    priority: Priority;
    timeSensitive: boolean;
    contactInfo: string;
    amountNeeded: number;
  }>({
    title: "",
    description: "",
    category: "Other",
    priority: "medium" as Priority,
    timeSensitive: false,
    contactInfo: "",
    amountNeeded: 0,
  }); // form because we dont want that many states

  const [submitting, setSubmitting] = useState(false); //state that shows whether it's being submitted rn or not
  const [error, setError] = useState<string | null>(null); //error to show users

  const reset = () => {
    setForm({
      title: "",
      description: "",
      category: "Other",
      priority: "medium",
      timeSensitive: false,
      contactInfo: "",
      amountNeeded: 0,
    }); //reset logic
    setError(null);
  };

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminID && !need) {
      setError("Missing admin ID. Please log in again.");
      return;
    }

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (form.amountNeeded <= 0) {
      setError("Amount needed must be greater than 0.");
      return; //validation stuffs
    }

    setSubmitting(true);
    try {
      const isEdit = Boolean(need?.id);
      const basePayload = { //trim whitespaces for free-text fields; category is a typed union so keep it as-is
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        contactInfo: form.contactInfo.trim(),
      };

      const payload = {
        need: {
          ...basePayload, //dupe
          id: need?.id as number,
          amountDonated: isEdit ? need!.amountDonated : 0,
          adminID: isEdit ? need!.adminID : (adminID as number),
        } as Need,
      } as { need: Need }; // payload we're sending to the endp

      await fetch("/api/cupboard", {
        method: isEdit ? "PUT" : "POST", //changing endp based on whether youre editing or creatin
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      reset(); //reset fields
      onCreated(); // 
    } catch (err) {
      setError("something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => { //resets on every new need, if there is a need passed through, that data is loaded in
    if (need) {
      setForm({
        title: need.title || "",
        description: need.description || "",
        category: need.category || "Other",
        priority: (need.priority as Priority) || "medium",
        timeSensitive: Boolean(need.timeSensitive),
        contactInfo: need.contactInfo || "",
        amountNeeded: need.amountNeeded || 0,
      });
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
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Need["category"] }))}
                >
                  <option value="Food">Food</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Priority</label>
              <select
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as Priority }))}
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
                value={form.contactInfo}
                onChange={(e) => setForm((p) => ({ ...p, contactInfo: e.target.value }))}
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
                value={form.amountNeeded}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9.]/g, "");
                  setForm((p) => ({ ...p, amountNeeded: cleaned ? Number(cleaned) : 0 }));
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
              checked={form.timeSensitive}
              onChange={(e) => setForm((p) => ({ ...p, timeSensitive: e.target.checked }))}
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
