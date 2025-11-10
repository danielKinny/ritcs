"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import { BasketItem } from "../types";
import NeedCard from "../comp/NeedCard";
import { toast } from "sonner";
import UserRoute from "../comp/UserRoute";

const BasketPage = () => {
  const { currentUser, setUser } = useUser(); //user ctx
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const handleCheckout = async () => {
    if (!currentUser?.id) {
      toast.error("No user logged in");
      return;
    }

    try {
      const res = await fetch(`/api/checkout`, {
        method: "POST",
        body: JSON.stringify({
          userID: currentUser.id,
        }), //only send across needID and donation amount as it's the only thing thats needed
        //why overcomplicate
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Checkout failed");
      }

      toast.success("Checkout successful!");
      setBasketItems([]); // clear basket
    } catch (err: any) {
      toast.error(err?.message || "Failed to checkout");
      // console.error(err);
    } finally {
      //logs user in again so that their donations ar e updated
      setUser(currentUser?.username || "", currentUser?.password || "");
    }
  };

  const fetchBasketItems = useCallback(async () => {
    if (!currentUser?.id) {
      setBasketItems([]);
      setLoading(false);
      return;
    } // gating users

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/basket?userID=${currentUser.id}`); // provide urlparams
      if (!res.ok) {
        throw new Error("Failed to fetch basket items");
      }
      const data = await res.json();
      setBasketItems(data || []); // wonderful state handling
      setLoading(false);
    } catch (err: any) {
      setError(
        err?.message || "An error occurred while fetching basket items."
      );
      setLoading(false);
    } finally {
      // console.log(basketItems); // logging purposes
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchBasketItems();
  }, [fetchBasketItems]);

  const handleBasketChange = (needId: number, added: boolean) => {
    if (!added) {
      setBasketItems((prev) => prev.filter((n) => n.id !== needId));
      return;
    } // handle basket state after one is removed
    fetchBasketItems();
  };

  const totals = useMemo(() => {
    //memoize for less calc, used in summary before checkout, recalcs if change in basketitems
    const totalDonated = basketItems.reduce(
      (sum, n) => sum + (n.donation || 0),
      0
    );
    return { totalDonated, count: basketItems.length };
  }, [basketItems]);

  return (
    <UserRoute>
      <div className="min-h-screen bg-gray-50 text-gray-900 px-6 py-8">
        <header className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold">My Basket</h1>
              <p className="text-sm text-gray-500">
                View and manage the needs you've saved
              </p>
            </div>
            <div className="flex items-center gap-3">
              {basketItems.length !== 0 && (
                <Link
                  href="/needs"
                  className="px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 hover:bg-blue-500 hover:text-white transition-colors shadow-sm"
                >
                  Browse Needs
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          {!currentUser?.id && (
            <div className="rounded-lg border p-6 bg-white text-center">
              <div className="text-lg font-semibold">You're not logged in</div>
              <p className="text-sm text-gray-600 mt-1">
                Please log in to view your basket.
              </p>
              <Link
                href="/"
                className="inline-block mt-4 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Go to Login
              </Link>
            </div>
          )}

          {currentUser?.id && (
            <div className="space-y-6">
              {loading && (
                <div className="rounded-lg border p-6 bg-white animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              )}

              {!loading && error && (
                <div className="rounded-lg border p-6 bg-white text-red-600">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <div>
                  {basketItems.length === 0 ? (
                    <div className="rounded-lg border p-8 bg-white text-center shadow-sm">
                      <div className="text-2xl">🧺</div>
                      <div className="text-lg font-semibold mt-3">
                        Your basket is empty
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Start exploring and add items you care about.
                      </p>
                      <Link
                        href="/needs"
                        className="inline-block mt-4 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Explore Needs
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <section className="lg:col-span-2 space-y-4 divide-y divide-gray-100">
                        {basketItems.map((need) => (
                          <div key={need.id} className="py-2">
                            <NeedCard //react's beauty once again
                              need={need}
                              addedToBasket={true}
                              userID={currentUser?.id}
                              onBasketChange={handleBasketChange}
                            />
                          </div>
                        ))}
                      </section>

                      <aside className="lg:col-span-1">
                        <div className="rounded-lg border p-5 bg-white sticky top-4 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-lg font-semibold">
                                Summary
                              </div>
                              <div className="text-xs text-gray-500">
                                Quick overview
                              </div>
                            </div>
                            <div className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                              Basket
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-3 rounded">
                              <div className="text-xs text-gray-500">Items</div>
                              <div className="text-xl font-bold text-gray-900">
                                {totals.count}
                              </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <div className="text-xs text-gray-500">
                                Total donated
                              </div>
                              <div className="text-xl font-bold text-green-700">
                                {totals.totalDonated.toFixed(2)} AED
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="text-xs text-gray-500 mb-2">
                              Contributions to remaining goal
                            </div>
                            <div className="space-y-3 max-h-44 overflow-auto pr-2">
                              {basketItems.map((item) => {
                                const percent = item.amountNeeded
                                  ? Math.min(
                                      100,
                                      ((item.donation || 0) /
                                        (item.amountNeeded -
                                          item.amountDonated)) *
                                        100
                                    )
                                  : 0;
                                const pctLabel =
                                  Math.round(percent * 100) / 100;
                                return (
                                  <div key={item.id}>
                                    <div className="flex justify-between text-sm">
                                      <div className="truncate pr-2">
                                        {item.title}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {pctLabel}%
                                      </div>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded mt-1">
                                      <div
                                        className="h-2 bg-green-500 rounded"
                                        style={{ width: `${percent}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            className="w-full mt-6 px-4 py-2 rounded-md cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-3"
                            disabled={basketItems.length === 0}
                            onClick={() => handleCheckout()}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden
                            >
                              <path d="M16 11V9a4 4 0 00-4-4H8V4a1 1 0 10-2 0v1H4a1 1 0 000 2h2v6a4 4 0 004 4h4a1 1 0 100-2h-4a2 2 0 01-2-2V9h4a2 2 0 012 2v2a1 1 0 102 0z" />
                            </svg>
                            <span className="font-medium">Checkout</span>
                            <span className="text-sm opacity-80">
                              · {totals.count} items
                            </span>
                            <span className="text-sm opacity-80">
                              {totals.totalDonated.toFixed(2)} AED
                            </span>
                          </button>
                        </div>
                      </aside>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </UserRoute>
  );
};

export default BasketPage;
