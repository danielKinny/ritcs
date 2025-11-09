import React from "react";
import { Need } from "../types";
import { fundedPercent } from "@/lib/utils";
import { ChevronDoubleUpIcon,
    ChevronUpIcon,
    ChevronDownIcon,
 } from "@heroicons/react/24/outline"; // thank you heroicons!

/**
 * 
 * this is NeedCard but with admin functions like edit and delete
 */

const priorityColor = (p: Need["priority"]) => {
  switch (p) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-green-100 text-green-800";
  }
}; //function to return color for elements based on need's priority

const priorityIcon = (p: Need["priority"]) => {
    switch (p) {
        case "high":
            return <ChevronDoubleUpIcon className="h-4 w-4 inline-block mr-1 text-red-600" />;
        case "medium":
            return <ChevronUpIcon className="h-4 w-4 inline-block mr-1 text-yellow-600" />;
        default:
            return <ChevronDownIcon className="h-4 w-4 inline-block mr-1 text-green-600" />;
    }
}; // same but for priority icons

export const NeedCard = ({ need, adminID, onEdit }: { need: Need, adminID: number, onEdit?: (n: Need) => void }) => {
    const percent = fundedPercent(need.amountDonated, need.amountNeeded); // using helpers

    return (
        <div
            key={need.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg cursor-pointer duration-150 transition-transform hover:scale-102"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">{need.title}</h2>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{need.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded ${priorityColor(
                                need.priority
                            )}`}
                        >
                            {priorityIcon(need.priority)}
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {need.category}
                        </span>
                        {need.timeSensitive && (
                            <span className="text-xs text-white bg-red-600 px-2 py-1 rounded">
                                Time sensitive
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>Donated: ${need.amountDonated}</div>
                    <div>Goal: ${need.amountNeeded}</div>
                </div>

                <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div style={{ width: `${percent}%` }} className="h-full bg-green-500" />
                </div>
                <div className="text-xs text-gray-500 mt-1">{percent}% funded</div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
                    onClick={ () => {
                        fetch(`/api/cupboard?needID=${need.id}`, {
                            method: "DELETE"
                        });
                    }}>
                       Delete Need
                    </button>
                    <button className="px-3 py-1 text-sm border rounded border-gray-200 hover:bg-gray-50" onClick={() => onEdit?.(need)}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NeedCard;
