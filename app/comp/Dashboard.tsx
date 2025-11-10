import {
  ArchiveBoxIcon,
  BanknotesIcon,
  BookOpenIcon,
  ChevronDoubleUpIcon,
  MagnifyingGlassIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import type { User, Need, StatsData } from "../types";
import React, { useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { priorityColor } from "@/lib/priority";

import { SparklesIcon } from "@heroicons/react/24/outline";

export const DashboardComp = ({
  currentUser,
  needs,
  statsData,
}: {
  currentUser: User;
  needs: Need[];
  statsData: StatsData;
}): React.ReactNode => {
  const adminBool = currentUser.role === "admin"; //bool stores whether user is admin or not so that we dont have to rewrite same code everytime
  const truncate = (s: string, n = 60) =>
    s.length > n ? s.slice(0, n).trimEnd() + "…" : s; //truncate text thats too long
  const priorityScore = (p: Need["priority"]) =>
    p === "high" ? 3 : p === "medium" ? 2 : 1; //quantify priority

  const topNeeds = useMemo(() => {
    return [...needs]
      .sort((a, b) => priorityScore(b.priority) - priorityScore(a.priority))
      .slice(0, 3);
  }, [needs]); //memoize what the top needs are, so as to not keep filtering and sorting on every render

  //used for stats
  const totalNeeds = needs.length;
  const topPriorityCount = needs.filter((n) => n.priority === "high").length;
  const pcPayload = [
    { label: "Food", value: statsData.needsByCategory.Food },
    { label: "Clothing", value: statsData.needsByCategory.Clothing },
    { label: "Shelter", value: statsData.needsByCategory.Shelter },
    { label: "Medical", value: statsData.needsByCategory.Medical },
    { label: "Education", value: statsData.needsByCategory.Education },
    { label: "Other", value: statsData.needsByCategory.Other },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-white via-sky-50 to-white">
      <div className="max-w-7xl w-full px-6 py-12">
        <div className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-64 h-64 border-r">
              <h1 className="text-center text-xl font-extrabold">
                <ChartPieIcon className="inline-block h-6 w-6 text-gray-500 mr-1 mb-1" />
                Current Needs
              </h1>
              <PieChart
                series={[
                  {
                    paddingAngle: 2,
                    innerRadius: "30%",
                    outerRadius: "80%",
                    data: [...pcPayload],
                  },
                ]}
                hideLegend
                className="cursor-pointer"
              />
            </div>
            <div className="flex-1 border-x px-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                Welcome back {currentUser?.username || "User"}!{" "}
                <SparklesIcon className="h-10 w-10 text-black-400 inline-block" />
              </h1>{" "}
              {/*fallback cos we're just like that*/}
              <p className="mt-4 text-gray-600 text-lg">
                {adminBool
                  ? "Manage, add, delete and track the progress of your estabilished needs"
                  : "Discover urgent needs, donate quickly, and track your impact. Welcome back — thank you for helping."}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {
                  !(currentUser?.role === "admin") && (
                    <Link
                      href="/needs"
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-3 text-white font-medium shadow hover:bg-indigo-700"
                    >
                      Explore Needs
                      <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                    </Link>
                  ) //only allow users to see needs
                }
                <Link
                  href={`/${
                    currentUser?.role === "admin" ? "cupboard" : "basket"
                  }`}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-indigo-600 px-5 py-3 text-indigo-600 font-medium hover:bg-indigo-50"
                >
                  {`My ${
                    currentUser?.role === "admin" ? " Cupboard" : " Basket"
                  }`}
                  <ArchiveBoxIcon className="h-6 w-6 text-blue-500" />
                </Link>{" "}
                {/*dynamic link based on role*/}
              </div>
              <div className="mt-6 flex gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="text-sm text-green-600 font-semibold">
                    Amount Donated{" "}
                    <BanknotesIcon className="h-4 w-4 inline-block" />
                  </div>
                  <div className="font-semibold text-green-600">
                    {currentUser?.role === "admin"
                      ? needs.reduce(
                          (sum, n) => sum + (Number(n.amountDonated) || 0),
                          0
                        )
                      : Number(currentUser?.amountDonated) || 0}{" "}
                    AED
                  </div>
                  {/* show the total donations collected if admin, or show user's total donations*/}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="text-sm text-red-500">
                    Top Priority Needs{" "}
                    <ChevronDoubleUpIcon className="h-4 w-4 inline-block" />
                  </div>
                  <div className="font-semibold text-red-600">
                    {topPriorityCount}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="text-sm text-blue-500">
                    Open Needs <BookOpenIcon className="h-4 w-4 inline-block" />
                  </div>
                  <div className="font-semibold text-blue-500">
                    {totalNeeds}
                  </div>
                </div>
              </div>
            </div>

            <aside className="w-full lg:w-80 border-l pl-4">
              <div className="rounded-lg border p-4 bg-white">
                <h3 className="text-lg font-extrabold border-b pb-2 text-center ">
                  {adminBool ? "Your top" : "Top"} needs
                </h3>
                <div className="mt-3 space-y-3">
                  {topNeeds.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No needs yet — check back soon.
                    </div> // checks if there arent any needs
                  ) : (
                    topNeeds.map((n) => {
                      return (
                        <div
                          key={n.id}
                          className="border-b pb-2 last:border-0 last:pb-0"
                        >
                          <h4 className="font-medium text-gray-900">
                            {truncate(n.title, 40)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {truncate(n.description, 60)}
                          </p>
                          <span
                            className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded ${priorityColor(
                              n.priority
                            )}`}
                          >
                            {n.priority.charAt(0).toUpperCase() +
                              n.priority.slice(1)}{" "}
                            Priority
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
