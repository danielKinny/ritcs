import React from "react";
import { BasketItem } from "../types";
import { Need } from "../types";
import { fundedPercent } from "@/lib/utils";
import { toast } from "sonner";
import { priorityColor, priorityIcon } from "@/lib/priority";

export const NeedCard = ({
  need,
  addedToBasket,
  userID,
  onBasketChange,
}: {
  need: Need | BasketItem;
  addedToBasket: boolean;
  userID: number;
  onBasketChange?: (needId: number, added: boolean) => void;
}) => {
  const [processing, setProcessing] = React.useState(false);

  const initialDonation = Number((need as BasketItem).donation) || 0;
  const [donationAmount, setDonationAmount] =
    React.useState<number>(initialDonation);

  const needed = Number(need.amountNeeded) || 0;
  const donated = Number(need.amountDonated) || 0;
  const remainingLimit = Math.max(0, needed - donated);
  const remaining = Math.max(0, needed - donated);

  React.useEffect(() => {
    setDonationAmount((prev) => Math.min(prev, remainingLimit));
  }, [remainingLimit]);

  async function handleBasketClick() {
    if (processing) return;
    setProcessing(true);
    try {
      const res = await fetch(
        `/api/basket?needID=${need.id}&userID=${userID}`,
        {
          method: addedToBasket ? "DELETE" : "POST",
          headers: addedToBasket
            ? undefined
            : { "Content-Type": "application/json" },
          body: addedToBasket ? undefined : JSON.stringify({ donationAmount }),
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText || "");
        toast.error("Error updating basket: " + (text || res.statusText));
        throw new Error("Failed to update basket: " + (text || res.statusText));
      }

      // callback shenanigans
      onBasketChange?.(need.id, !addedToBasket);
      toast.success(
        "Need " +
          (addedToBasket
            ? "removed from basket"
            : `added to basket (pledged $${donationAmount})`)
      );
    } catch (error) {
      // console.error("Error updating basket:", error);
      void error;
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div
      key={need.id}
      className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg duration-150 transition-transform hover:scale-102"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">{need.title}</h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">
            {need.description}
          </p>
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
          <div>
            Donated: $
            {donated.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div>
            Goal: $
            {needed.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            style={{ width: `${fundedPercent(donated, needed)}%` }}
            className="h-full bg-green-500"
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {fundedPercent(donated, needed)}% funded
        </div>

        {!addedToBasket && (
          <div className="mt-3">
            <label className="text-sm text-gray-700 mb-1 block">
              Donate amount
            </label>
            <div className="flex items-center gap-3">
              <input
                aria-label={`Select donation amount up to $${remaining}`}
                type="range"
                min={0}
                max={remainingLimit}
                step={1}
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value || 0))}
                className="w-full"
                disabled={remaining <= 0 && donationAmount === 0}
              />

              <input
                aria-label="Donation amount input"
                type="number"
                className="w-20 pl-2 pr-2 py-1 text-sm border rounded"
                min={0}
                step={1}
                value={donationAmount}
                max={remainingLimit}
                onChange={(e) => {
                  const v = Number(e.target.value || 0);
                  const safe = Number.isNaN(v) ? 0 : v;
                  setDonationAmount(Math.min(safe, remainingLimit));
                }}
              />
            </div>
            <div className="w-full text-right text-sm font-medium mt-2">
              Selected: ${donationAmount}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <a
          className="text-sm text-blue-600 hover:underline cursor-pointer"
          href={`mailto:${need.contactInfo.split(" | ")[0] ?? ""}`}
        >
          Contact
        </a>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-sm cursor-pointer  text-white rounded ${
              addedToBasket
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => handleBasketClick()}
            disabled={processing}
          >
            {addedToBasket ? "Remove From" : "Add To"} Basket
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeedCard;
