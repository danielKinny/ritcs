import React from "react";
import { Need } from "../types";
import { fundedPercent } from "@/lib/utils";
import { toast } from "sonner";
import { priorityColor, priorityIcon } from "@/lib/priority";

export const AdminCard = ({ need, onEdit, onDelete }: { need: Need; adminID: number; onEdit?: (n: Need) => void; onDelete?: () => Promise<void> }) => {
    const donated = Number(need.amountDonated) || 0;
    const needed = Number(need.amountNeeded) || 0;
    const percent = fundedPercent(donated, needed);

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/cupboard?needID=${need.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                toast.success("Need deleted successfully.");
                await onDelete?.();
            } else {
                const errorData = await res.json();
                toast.error(`Error deleting need: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error deleting need:", error);
            toast.error("Error deleting need.");
        }
    };

    const handleClose = async () => {
        try {
            const res = await fetch(`/api/needs?needID=${need.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                toast.success("Need closed successfully.");
                await onDelete?.();
            } else {
                const errorData = await res.json();
                toast.error(`Error closing need: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error closing need:", error);
            toast.error("Error closing need.");
        }
    };

    return (
        <div key={need.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg duration-150 transition-transform hover:scale-102">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">{need.title}</h2>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{need.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColor(need.priority)}`}>{priorityIcon(need.priority)}</span>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{need.category}</span>
                        {need.timeSensitive && <span className="text-xs text-white bg-red-600 px-2 py-1 rounded">Time sensitive</span>}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>Donated: ${donated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div>Goal: ${needed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>

                <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div style={{ width: `${percent}%` }} className="h-full bg-green-500" />
                </div>
                <div className="text-xs text-gray-500 mt-1">{percent}% funded</div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
                        onClick={() => (donated < needed ? handleDelete() : handleClose())}
                    >
                        {donated < needed ? "Delete Need" : "Close Need"}
                    </button>
                    <button className="px-3 py-1 text-sm border rounded border-gray-200 hover:bg-gray-50" onClick={() => onEdit?.(need)}>Edit</button>
                </div>
            </div>
        </div>
    );
};

export default AdminCard;
