"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

interface Issue {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    address: string;
    landmark: string | null;
    category: string;
    area: string | null;
    status: string;
    citizen: {
        firstname: string;
        lastname: string;
        mobile: string | null;
        email: string;
    };
    department: {
        name: string;
    } | null;
    officer: {
        userId: number;
    } | null;
    createdAt: string;
}

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function IssueDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [issue, setIssue] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {
        if (!id) return;
        const fetchIssue = async () => {
            try {
                const response = await api.get(`/issues/${id}`);
                setIssue(response.data);
                setSelectedStatus(response.data.status);
            } catch (error) {
                console.error("Failed to fetch issue", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIssue();
    }, [id]);

    const handleStatusUpdate = async () => {
        if (!issue) return;
        setUpdating(true);
        try {
            await api.patch(`/issues/${issue.id}/status`, {
                status: selectedStatus,
            });
            alert("Status updated successfully");
            // Refresh data
            const response = await api.get(`/issues/${id}`);
            setIssue(response.data);
        } catch (error: any) {
            console.error("Failed to update status", error);
            alert(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!issue) return <div>Issue not found</div>;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    Issue #{issue.id}: {issue.title}
                </h2>
                <Badge
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
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left Column: Details */}
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Description</h3>
                        <p className="text-gray-500 dark:text-gray-400">{issue.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-800 dark:text-white/90">Category</h4>
                            <p className="text-gray-500 dark:text-gray-400">{issue.category}</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-800 dark:text-white/90">Area</h4>
                            <p className="text-gray-500 dark:text-gray-400">{issue.area || "N/A"}</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-800 dark:text-white/90">Address</h4>
                            <p className="text-gray-500 dark:text-gray-400">{issue.address}</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-800 dark:text-white/90">Landmark</h4>
                            <p className="text-gray-500 dark:text-gray-400">{issue.landmark || "N/A"}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 dark:border-white/[0.05]">
                        <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Reporter Details</h3>
                        <p className="text-gray-500 dark:text-gray-400">Name: {issue.citizen?.firstname} {issue.citizen?.lastname}</p>
                        <p className="text-gray-500 dark:text-gray-400">Email: {issue.citizen?.email}</p>
                        <p className="text-gray-500 dark:text-gray-400">Mobile: {issue.citizen?.mobile || "N/A"}</p>
                    </div>

                    <div className="border-t border-gray-100 pt-4 dark:border-white/[0.05]">
                        <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Assignment</h3>
                        <p className="text-gray-500 dark:text-gray-400">Department: {issue.department?.name || "Unassigned"}</p>
                        <p className="text-gray-500 dark:text-gray-400">Officer ID: {issue.officer?.userId || "Unassigned"}</p>
                    </div>
                </div>

                {/* Right Column: Image and Actions */}
                <div className="space-y-6">
                    {issue.imageUrl && (
                        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/[0.05]">
                            <img
                                src={issue.imageUrl}
                                alt="Issue Image"
                                className="w-full h-auto object-cover rounded-lg"
                            />

                        </div>
                    )}

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                        <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">Update Status</h3>
                        <div className="flex gap-4">
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <Button onClick={handleStatusUpdate} disabled={updating}>
                                {updating ? "Updating..." : "Update"}
                            </Button>
                        </div>
                    </div>

                    <Button variant="outline" onClick={() => router.back()}>
                        Back to List
                    </Button>
                </div>
            </div>
        </div>
    );
}
