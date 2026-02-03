"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";
import { EyeIcon } from "@/icons";

interface Issue {
    id: number;
    title: string;
    status: string;
    category: string;
    citizen: {
        firstname: string;
        lastname: string;
    };
    createdAt: string;
}

export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await api.get("/issues");
                console.log("Issues API Response:", response.data);
                if (Array.isArray(response.data)) {
                    setIssues(response.data);
                } else {
                    console.error("Expected array but got:", response.data);
                    setIssues([]);
                }
            } catch (error) {
                console.error("Failed to fetch issues", error);
                setIssues([]);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!Array.isArray(issues)) return <div>Error: Invalid data format</div>;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Issues Management
                </h2>
            </div>
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    ID
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Title
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Category
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Citizen
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Date
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {issues.map((issue) => (
                                <TableRow key={issue.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 dark:text-gray-400">
                                        #{issue.id}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start">
                                        {issue.title}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-start">
                                        {issue.category}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start">
                                        {issue.citizen?.firstname} {issue.citizen?.lastname}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Badge
                                            size="sm"
                                            color={
                                                issue.status === "RESOLVED"
                                                    ? "success"
                                                    : issue.status === "OPEN"
                                                        ? "error"
                                                        : "warning"
                                            }
                                        >
                                            {issue.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {new Date(issue.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        <Link href={`/issues/${issue.id}`} className="hover:text-primary-500">
                                            <EyeIcon className="size-5" />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
