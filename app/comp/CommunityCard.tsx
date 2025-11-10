import React from "react";
import { CommunityItem } from "../types";

const CommunityCard = ({ item }: { item: CommunityItem }) => {
  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 duration-150 cursor-pointer p-4">
      <div className="flex flex-col">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 notable-regular truncate">{item.title}</h3>
            <div className="text-xs text-gray-500 mt-0.5">{new Date(item.createdAt).toLocaleString()}</div>
          </div>
        </header>

        <p className="text-sm text-gray-700 mt-3 line-clamp-4">{item.description}</p>

        <footer className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{item.category}</span>
          </div>

          <div>
            <button className="text-sm text-blue-600 hover:underline">View</button>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default CommunityCard;
