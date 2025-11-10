"use client";
import React, { useEffect, useState } from "react";
import { Need, User, StatsData } from "../types";
import { useUser } from "../context/UserContext";
import { DashboardComp } from "../comp/Dashboard";
import Route from "../comp/Route";
const LandingDashboard = () => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const defaultStats: StatsData = {
    totalNeeds: 0,
    totalNeeded: 0,
    totalDonated: 0,
    needsByCategory: {
      Food: 0,
      Clothing: 0,
      Shelter: 0,
      Medical: 0,
      Education: 0,
      Other: 0,
    },
  };

  const [statsData, setStatsData] = useState<StatsData>(defaultStats);
  const {
    currentUser,
  } = useUser(); //user ctx

  useEffect( () => {
          const fetchData = async () => {
              try {
                  const res = await fetch('/api/impact')
                  if (!res.ok) {
                      throw new Error('Failed to fetch impact data')
                  }
                  const statsData = await res.json()
                  setStatsData(statsData)
              } catch (error) {
                  console.error('Error fetching impact data:', error)
              }
          }
          fetchData()
      }, [])

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        /**
         * endp is a variable that represents the api endpoint from which needs are being fetched
         * if the user is an admin, it fetches all the needs that the admin created
         * if the user is a regular user, it fetches all the needs avaialable
         */
        const endp = currentUser?.role === 'admin' ? "/api/cupboard/?adminID=" + (currentUser?.id || "") : "/api/needs/?userID=" + (currentUser?.id || "");
        const resp = await fetch(endp);
        if (resp.ok) {
          const data = await resp.json();
          setNeeds(currentUser?.role === 'admin' ? data || [] : data.needs || []);
          /**
           * there is a difference in how each different endpoint returns the data
           * the endp. meant for admins returns an array of needs directly
           * the other returns an object with needs prop.
           */
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNeeds();
  }, []);

  return (
    <Route>
          <DashboardComp currentUser={currentUser as User} needs={needs as Need[]} statsData={statsData} />
    </Route>
    //react is goated
  );
};

export default LandingDashboard;
