"use client";
import React, { useEffect, useState } from "react";
import { AvgResolutionTimeChart, IssuesByAreaChart, DepartmentEfficiencyChart, MonthlyTrendChart } from "@/components/civic/CivicComponents";
import api from "@/utils/api";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get("/issues/analytics");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                        Analytics & Reports
                    </h2>
                    <p className="text-sm text-gray-500">Insights into issue resolution and performance</p>
                </div>

                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-center font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        Last 30 days
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-center font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        Export CSV
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-center font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 mb-6">
                <MonthlyTrendChart data={data?.monthlyTrend} />
                <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                        <span className="text-sm text-gray-500">Avg Resolution Time</span>
                        <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">18.5h</h4>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                        <span className="text-sm text-gray-500">SLA Compliance</span>
                        <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">94%</h4>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-6">
                <AvgResolutionTimeChart />
                <IssuesByAreaChart data={data?.issuesByArea} />
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6">
                <DepartmentEfficiencyChart data={data?.departmentEfficiency} />
            </div>

        </div>
    );
}
