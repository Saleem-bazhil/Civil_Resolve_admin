"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import Badge from "@/components/ui/badge/Badge"; // Assuming Badge is available
import { MoreDotIcon } from "@/icons";
import api from "@/utils/api";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// --- DASHBOARD COMPONENTS ---

export const IssuesTrendChart = () => {
    const [chartData, setChartData] = React.useState<{ categories: string[]; data: number[] } | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/issues/chart-data");
                setChartData(response.data);
            } catch (error) {
                console.error("Failed to fetch chart data", error);
            }
        };
        fetchData();
    }, []);

    const options: ApexOptions = {
        chart: { type: "bar", toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
        colors: ["#465fff"],
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "40%",
            }
        },
        xaxis: {
            categories: chartData?.categories || [],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: "#9CA3AF" } }
        },
        yaxis: {
            labels: { style: { colors: "#9CA3AF" } }
        },
        grid: { strokeDashArray: 5, borderColor: "#E5E7EB" },
        dataLabels: { enabled: false },
        tooltip: { enabled: true },
    };
    const series = [{ name: "Issues Created", data: chartData?.data || [] }];

    return (
        <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Issues Trend</h3>
                    <p className="text-sm text-gray-500">Last 7 days</p>
                </div>
            </div>
            <ReactApexChart options={options} series={series} type="bar" height={250} />
        </div>
    );
};


export const DepartmentPerformance = () => {
    const [depts, setDepts] = React.useState<{ name: string; pending: number; resolved: number; iconClass: string }[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/issues/analytics");
                if (response.data && response.data.departmentEfficiency) {
                    const mapped = response.data.departmentEfficiency.map((d: any) => ({
                        name: d.name,
                        pending: d.pending,
                        resolved: d.resolved,
                        iconClass: "bg-blue-50 text-brand-500"
                    }));
                    setDepts(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch department performance", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Department Performance</h3>
                <button className="text-sm text-brand-500 font-medium">View all</button>
            </div>
            <div className="space-y-4">
                {depts.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${d.iconClass}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-800 dark:text-white">{d.name}</h4>
                                <p className="text-xs text-gray-500">{d.pending} pending</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h4 className="text-sm font-medium text-success-500">{d.resolved}</h4>
                            <p className="text-xs text-gray-500">resolved</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const RecentIssues = () => {
    const [issues, setIssues] = React.useState<{ id: string; title: string; category: string; location: string; status: string; sla: string; categoryColor: string }[]>([]);

    const getCategoryColor = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'water': return "text-blue-500 bg-blue-50";
            case 'electricity': return "text-yellow-500 bg-yellow-50";
            case 'roads': return "text-orange-500 bg-orange-50";
            case 'sanitation': return "text-green-500 bg-green-50";
            default: return "text-gray-500 bg-gray-50";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'OPEN': return 'Pending';
            case 'IN_PROGRESS': return 'In Progress';
            case 'RESOLVED': return 'Resolved';
            default: return status;
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/issues");
                const mapped = response.data.slice(0, 5).map((issue: any) => ({
                    id: `ISS-${issue.id}`,
                    title: issue.title,
                    category: issue.category,
                    location: issue.area || issue.address,
                    status: getStatusLabel(issue.status),
                    sla: "24h left", // Placeholder
                    categoryColor: getCategoryColor(issue.category)
                }));
                setIssues(mapped);
            } catch (error) {
                console.error("Failed to fetch recent issues", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Issues</h3>
                    <p className="text-sm text-gray-500">Latest reported issues</p>
                </div>
                <button className="text-sm text-brand-500 font-medium">View all &gt;</button>
            </div>

            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-50 text-left dark:bg-white/[0.03]">
                            <th className="px-4 py-3 font-medium text-gray-500 text-sm">Issue ID</th>
                            <th className="px-4 py-3 font-medium text-gray-500 text-sm">Title</th>
                            <th className="px-4 py-3 font-medium text-gray-500 text-sm">Category</th>
                            <th className="px-4 py-3 font-medium text-gray-500 text-sm">Location</th>
                            <th className="px-4 py-3 font-medium text-gray-500 text-sm">Status</th>
                            <th className="px-4 py-3 font-medium text-gray-500 text-sm">SLA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map((issue, i) => (
                            <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">{issue.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium">{issue.title}</td>
                                <td className="px-4 py-3">
                                    <div className={`inline-flex items-center justify-center p-1.5 rounded-lg ${issue.categoryColor}`}>
                                        {/* Icon placeholder */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{issue.location}</td>
                                <td className="px-4 py-3">
                                    <Badge
                                        color={
                                            issue.status === "Resolved"
                                                ? "success"
                                                : issue.status === "Overdue"
                                                    ? "error"
                                                    : issue.status === "In Progress"
                                                        ? "info"
                                                        : issue.status === "Pending" ? "warning" : "light"
                                        }
                                        size="sm"
                                    >
                                        {issue.status}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <span className={`${issue.sla === "Overdue" ? "text-error-500 font-medium" : issue.sla.includes("left") ? "text-warning-500" : "text-gray-500"}`}>
                                        {issue.sla === "Overdue" ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Overdue</span> : <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>{issue.sla}</span>}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- ANALYTICS COMPONENTS ---

export const MonthlyTrendChart = ({ data }: { data: { categories: string[], reported: number[], resolved: number[] } }) => {
    const options: ApexOptions = {
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "area",
            height: 310,
            toolbar: { show: false },
        },
        colors: ["#F59E0B", "#10B981"], // Reported (Orange), Resolved (Green)
        fill: {
            type: "gradient",
            gradient: { opacityFrom: 0.55, opacityTo: 0 },
        },
        stroke: { curve: "smooth", width: 2 },
        dataLabels: { enabled: false },
        xaxis: {
            categories: data?.categories || [],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        tooltip: { enabled: true },
        legend: {
            position: 'bottom',
        },
    };

    const series = [
        { name: "Reported", data: data?.reported || [] },
        { name: "Resolved", data: data?.resolved || [] },
    ];

    return (
        <div className="col-span-12 xl:col-span-8 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Trend</h3>
            <ReactApexChart options={options} series={series} type="area" height={250} />
        </div>
    );
};

export const AvgResolutionTimeChart = () => {
    const options: ApexOptions = {
        chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
        plotOptions: { bar: { horizontal: true, barHeight: "40%", borderRadius: 4 } },
        colors: ["#1D4ED8", "#FDE047"], // Deep Blue, Yellowish
        dataLabels: { enabled: false },
        stroke: { width: 0 },
        xaxis: { categories: ["Water", "Electricity", "Roads", "Sanitation", "Environment"], labels: { style: { colors: "#9CA3AF" } } },
        legend: { position: "bottom" },
    };
    const series = [
        { name: "Avg Time (hrs)", data: [12, 22, 40, 6, 42] },
        { name: "Target (hrs)", data: [24, 24, 48, 12, 48] },
    ];

    return (
        <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Avg Resolution Time by Category</h3>
            <ReactApexChart options={options} series={series} type="bar" height={300} />
        </div>
    );
};

export const IssuesByAreaChart = ({ data }: { data: { area: string; total: number; resolved: number }[] }) => {
    const options: ApexOptions = {
        chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
        plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 } },
        colors: ["#F59E0B", "#10B981"], // Orange, Green
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
            categories: data?.map(d => d.area) || [],
            labels: { style: { colors: "#9CA3AF" } }
        },
        legend: { position: "bottom" },
    };
    const series = [
        { name: "Total Issues", data: data?.map(d => d.total) || [] },
        { name: "Resolved", data: data?.map(d => d.resolved) || [] },
    ];
    return (
        <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Issues by Area</h3>
            <ReactApexChart options={options} series={series} type="bar" height={300} />
        </div>
    );
};

export const DepartmentEfficiencyChart = ({ data }: { data: { name: string; resolved: number; pending: number }[] }) => {
    const options: ApexOptions = {
        chart: { type: "bar", stacked: true, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
        colors: ["#10B981", "#F59E0B"], // Green, Orange
        plotOptions: { bar: { borderRadius: 4, columnWidth: "30%" } },
        xaxis: {
            categories: data?.map(d => d.name) || [],
            labels: { style: { colors: "#9CA3AF" } }
        },
        legend: { position: "bottom" },
    };
    const series = [
        { name: "Resolved", data: data?.map(d => d.resolved) || [] },
        { name: "Pending", data: data?.map(d => d.pending) || [] },
    ];
    return (
        <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Department Efficiency</h3>
            <ReactApexChart options={options} series={series} type="bar" height={300} />
        </div>
    );
};

export const OfficerPerformanceTable = () => {
    const officers = [
        { name: "Rajesh Kumar", resolved: 142, avgTime: "18.5 hrs", compliance: "94%", performance: 90 },
        { name: "Priya Sharma", resolved: 98, avgTime: "22.3 hrs", compliance: "91%", performance: 85 },
        { name: "Sunita Devi", resolved: 215, avgTime: "8.2 hrs", compliance: "98%", performance: 98 },
        { name: "Amit Patel", resolved: 76, avgTime: "28.1 hrs", compliance: "85%", performance: 70 },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Officer Performance</h3>
                </div>
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.03]">
                    Export
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="py-3 font-medium text-gray-500 text-sm">Officer Name</th>
                            <th className="py-3 font-medium text-gray-500 text-sm">Issues Resolved</th>
                            <th className="py-3 font-medium text-gray-500 text-sm">Avg Resolution Time</th>
                            <th className="py-3 font-medium text-gray-500 text-sm">SLA Compliance</th>
                            <th className="py-3 font-medium text-gray-500 text-sm">Performance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {officers.map((off, i) => (
                            <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <td className="py-4 text-sm font-medium text-gray-800 dark:text-white">{off.name}</td>
                                <td className="py-4 text-sm text-gray-800 dark:text-white">{off.resolved}</td>
                                <td className="py-4 text-sm text-gray-800 dark:text-white">{off.avgTime}</td>
                                <td className="py-4 text-sm font-medium text-success-500">{off.compliance}</td>
                                <td className="py-4">
                                    <div className="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div className={`h-1.5 rounded-full ${off.performance > 90 ? 'bg-success-500' : off.performance > 80 ? 'bg-success-500' : 'bg-warning-500'}`} style={{ width: `${off.performance}%` }}></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
