"use client";
import React from "react";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, AlertIcon, CheckCircleIcon, TimeIcon, MoreDotIcon } from "@/icons";
import api from "@/utils/api";

export const EcommerceMetrics = () => {
  const [stats, setStats] = React.useState({
    total: 0,
    open: 0,
    resolved: 0,
    inProgress: 0,
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/issues/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
        </div>

        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Issues
          </span>
          <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {stats.total}
          </h4>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-orange-50 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-gray-800">
            <TimeIcon className="text-orange-500 size-6" />
          </div>
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Open / Pending
          </span>
          <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {stats.open}
          </h4>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-blue-50 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-gray-800">
            <TimeIcon className="text-blue-500 size-6" />
          </div>
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            In Progress
          </span>
          <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {stats.inProgress}
          </h4>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-green-50 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-gray-800">
            <CheckCircleIcon className="text-green-500 size-6" />
          </div>
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Resolved
          </span>
          <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {stats.resolved}
          </h4>
        </div>
      </div>
    </div>
  );
};
