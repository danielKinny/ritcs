import React from "react";
import { CommunityItem } from "../types";

const CommunityCard = ({ item }: { item: CommunityItem }) => {
  return (
    <article className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-transform hover:scale-103 cursor-pointer">
      <header className="mb-2">
        <h3 className="text-md font-semibold text-gray-900 notable-regular">{item.title}</h3>
        <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
      </header>

      <p className="text-sm text-gray-700 line-clamp-4">{item.description}</p>

      <footer className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{item.category}</span>
      </footer>
    </article>
  );
};

export default CommunityCard;
