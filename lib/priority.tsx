import React from "react";
import type { Need } from "@/app/types";
import { ChevronDoubleUpIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export const priorityColor = (p: Need["priority"]) => {
  switch (p) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-green-100 text-green-800";
  }
};

export const priorityIcon = (p: Need["priority"]) => {
  switch (p) {
    case "high":
      return <ChevronDoubleUpIcon className="h-4 w-4 inline-block mr-1 text-red-600" />;
    case "medium":
      return <ChevronUpIcon className="h-4 w-4 inline-block mr-1 text-yellow-600" />;
    default:
      return <ChevronDownIcon className="h-4 w-4 inline-block mr-1 text-green-600" />;
  }
};

export default { priorityColor, priorityIcon };
