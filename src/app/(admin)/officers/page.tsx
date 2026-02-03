"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Badge from "@/components/ui/badge/Badge";

interface Officer {
    id: number;
    userId: number;
    name: string;
    email: string;
    mobile: string;
    department: string;
    area: string;
    activeIssues: number;
    isActive: boolean;
}

interface Department {
    id: number;
    name: string;
}

export default function OfficersPage() {
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All Departments");
    const [statusFilter, setStatusFilter] = useState("All Status");

    // Modal State
    const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        departmentId: "",
        area: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [officersRes, deptsRes] = await Promise.all([
                    api.get("/users/officers"),
                    api.get("/users/departments")
                ]);
                setOfficers(officersRes.data);
                setDepartments(deptsRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateOfficer = async () => {
        try {
            await api.post("/users/officer", formData);
            alert("Officer created successfully!");
            setIsOfficerModalOpen(false);
            const response = await api.get("/users/officers");
            setOfficers(response.data);
            setFormData({ firstname: "", lastname: "", email: "", password: "", departmentId: "", area: "" });
        } catch (error: any) {
            console.error("Failed to create officer", error);
            alert(error.response?.data?.message || "Failed to create officer");
        }
    };

    const filteredOfficers = officers.filter(officer => {
        const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            officer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === "All Departments" || officer.department === departmentFilter;
        const matchesStatus = statusFilter === "All Status" ||
            (statusFilter === "Active" ? officer.isActive : !officer.isActive);
        return matchesSearch && matchesDept && matchesStatus;
    });

    const stats = {
        total: officers.length,
        active: officers.filter(o => o.isActive).length,
        inactive: officers.filter(o => !o.isActive).length,
        departments: new Set(officers.map(o => o.department)).size
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Officer Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage officers, departments, and area assignments</p>
                </div>
                <Button onClick={() => setIsOfficerModalOpen(true)}>+ Add Officer</Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-gray-200 dark:border-white/[0.05]">
                <div className="w-full md:w-1/3">
                    <Input
                        placeholder="Search officers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                        <option>All Departments</option>
                        {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                    <select
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard title="Total Officers" value={stats.total} />
                <StatsCard title="Active" value={stats.active} color="text-success-500" />
                <StatsCard title="Inactive" value={stats.inactive} color="text-gray-500" />
                <StatsCard title="Departments" value={stats.departments} />
            </div>

            {/* Officers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOfficers.map(officer => (
                    <div key={officer.id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03] hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg dark:bg-brand-500/20 dark:text-brand-400">
                                    {officer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white">{officer.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{officer.department}</p>
                                </div>
                            </div>
                            <div className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                {/* Three dots icon */}
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0002 11.6667C10.9207 11.6667 11.6668 10.9205 11.6668 10C11.6668 9.07955 10.9207 8.33335 10.0002 8.33335C9.07971 8.33335 8.3335 9.07955 8.3335 10C8.3335 10.9205 9.07971 11.6667 10.0002 11.6667Z" stroke="currentColor" strokeWidth="1.5" /><path d="M16.6668 11.6667C17.5873 11.6667 18.3335 10.9205 18.3335 10C18.3335 9.07955 17.5873 8.33335 16.6668 8.33335C15.7463 8.33335 15.0002 9.07955 15.0002 10C15.0002 10.9205 15.7463 11.6667 16.6668 11.6667Z" stroke="currentColor" strokeWidth="1.5" /><path d="M3.3335 11.6667C4.25397 11.6667 5.00016 10.9205 5.00016 10C5.00016 9.07955 4.25397 8.33335 3.3335 8.33335C2.41302 8.33335 1.66683 9.07955 1.66683 10C1.66683 10.9205 2.41302 11.6667 3.3335 11.6667Z" stroke="currentColor" strokeWidth="1.5" /></svg>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="w-4">✉️</span> {officer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="w-4">📞</span> {officer.mobile || "N/A"}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="w-4">📍</span> {officer.area}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                            <Badge color={officer.isActive ? "success" : "light"} size="sm">
                                {officer.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <div className="text-right">
                                <div className="text-xl font-bold text-gray-800 dark:text-white">{officer.activeIssues}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">active issues</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Officer Modal */}
            <Modal isOpen={isOfficerModalOpen} onClose={() => setIsOfficerModalOpen(false)} className="max-w-[600px] m-4">
                <div className="p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Add New Officer</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <Label>First Name</Label>
                            <Input placeholder="John" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
                        </div>
                        <div className="col-span-1">
                            <Label>Last Name</Label>
                            <Input placeholder="Doe" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                            <Label>Email</Label>
                            <Input placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                            <Label>Password</Label>
                            <Input type="password" placeholder="******" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                        <div className="col-span-1">
                            <Label>Department</Label>
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="col-span-1">
                            <Label>Area</Label>
                            <Input placeholder="e.g. North Zone" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsOfficerModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateOfficer}>Create Officer</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

function StatsCard({ title, value, color = "text-gray-800 dark:text-white" }: { title: string, value: number, color?: string }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h4 className={`mt-2 text-2xl font-bold ${color}`}>{value}</h4>
        </div>
    );
}
