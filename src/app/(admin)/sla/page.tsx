"use client";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { MoreDotIcon, TimeIcon, AlertIcon, UserIcon, PencilIcon, TrashBinIcon } from "@/icons";

interface SLARule {
    category: string;
    priority: "High" | "Medium" | "Low";
    slaHours: number;
    escalationRules: string[];
}

const slaRules: SLARule[] = [
    {
        category: "Water Supply",
        priority: "High",
        slaHours: 12,
        escalationRules: ["50%: Notify Supervisor", "25%: Notify Admin"],
    },
    {
        category: "Water Supply",
        priority: "Medium",
        slaHours: 24,
        escalationRules: ["25%: Notify Supervisor"],
    },
    {
        category: "Electricity",
        priority: "High",
        slaHours: 6,
        escalationRules: ["50%: Notify Supervisor", "25%: Auto Reassign"],
    },
    {
        category: "Roads",
        priority: "High",
        slaHours: 24,
        escalationRules: ["25%: Notify Admin"],
    },
    {
        category: "Sanitation",
        priority: "Medium",
        slaHours: 12,
        escalationRules: [],
    }
];

export default function SLAPage() {
    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                        SLA Configuration
                    </h2>
                    <p className="text-sm text-gray-500">Configure SLA hours and escalation rules per category</p>
                </div>

                <button className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-3 text-center font-medium text-white hover:bg-opacity-90">
                    + Add SLA Rule
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 mb-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] flex items-start gap-4">
                    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-500/20">
                        <TimeIcon />
                    </div>
                    <div>
                        <h4 className="font-bold text-black dark:text-white">SLA Hours</h4>
                        <p className="text-sm text-gray-500">Define resolution time limits for each category and priority combination.</p>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] flex items-start gap-4">
                    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-warning-50 text-warning-500 dark:bg-warning-500/20">
                        <AlertIcon />
                    </div>
                    <div>
                        <h4 className="font-bold text-black dark:text-white">Escalation Rules</h4>
                        <p className="text-sm text-gray-500">Set automatic actions when SLA thresholds are approaching.</p>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] flex items-start gap-4">
                    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-purple-50 text-purple-500 dark:bg-purple-500/20">
                        <UserIcon />
                    </div>
                    <div>
                        <h4 className="font-bold text-black dark:text-white">Supervisors</h4>
                        <p className="text-sm text-gray-500">Assign supervisors to receive escalation notifications.</p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-2.5 pt-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-left">
                                <th className="min-w-[150px] px-4 py-4 font-normal text-gray-500 dark:text-gray-400">
                                    Category
                                </th>
                                <th className="min-w-[120px] px-4 py-4 font-normal text-gray-500 dark:text-gray-400">
                                    Priority
                                </th>
                                <th className="min-w-[120px] px-4 py-4 font-normal text-gray-500 dark:text-gray-400">
                                    SLA Hours
                                </th>
                                <th className="min-w-[300px] px-4 py-4 font-normal text-gray-500 dark:text-gray-400">
                                    Escalation Rules
                                </th>
                                <th className="px-4 py-4 font-normal text-right text-gray-500 dark:text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {slaRules.map((rule, key) => (
                                <tr key={key} className="border-t border-gray-100 dark:border-gray-800">
                                    <td className="px-4 py-5">
                                        <div className="flex items-center gap-2">
                                            {/* Placeholder icon for category logic */}
                                            <div className="h-2 w-2 rounded-full bg-brand-500"></div>
                                            <p className="text-black dark:text-white">{rule.category}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className={`text-sm font-medium ${rule.priority === 'High' ? 'text-error-500' : rule.priority === 'Medium' ? 'text-warning-500' : 'text-success-500'}`}>
                                            {rule.priority === 'High' ? '^ High' : rule.priority === 'Medium' ? '- Medium' : 'v Low'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex items-center gap-2 text-black dark:text-white">
                                            <TimeIcon className="h-4 w-4 text-gray-400" />
                                            {rule.slaHours} hours
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex flex-wrap gap-2">
                                            {rule.escalationRules.length > 0 ? rule.escalationRules.map((esc, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                    <AlertIcon className="h-3 w-3" />
                                                    {esc}
                                                </span>
                                            )) : <span className="text-gray-400 text-sm">No rules configured</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex items-center justify-end space-x-3.5">
                                            <button className="hover:text-primary p-2">
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button className="hover:text-error-500 p-2">
                                                <TrashBinIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
