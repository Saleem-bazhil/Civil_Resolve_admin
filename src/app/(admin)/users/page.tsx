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

interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    CreatedAt: string;
}

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface Department {
    id: number;
    name: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        departmentId: "",
        area: ""
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await api.get("/users/departments");
                setDepartments(response.data);
            } catch (error) {
                console.error("Failed to fetch departments", error);
            }
        };

        fetchUsers();
        fetchDepartments();
    }, []);

    const handleCreateOfficer = async () => {
        try {
            await api.post("/users/officer", formData);
            alert("Officer created successfully!");
            setIsOfficerModalOpen(false);
            // Refresh users
            const response = await api.get("/users");
            setUsers(response.data);
            // Reset form
            setFormData({ firstname: "", lastname: "", email: "", password: "", departmentId: "", area: "" });
        } catch (error: any) {
            console.error("Failed to create officer", error);
            alert(error.response?.data?.message || "Failed to create officer");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="p-6 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Users Management
                </h2>
                <Button onClick={() => setIsOfficerModalOpen(true)}>Add Officer</Button>
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
                                    Name
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Email
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Role
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Created At
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 dark:text-gray-400">
                                        #{user.id}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start">
                                        {user.firstname} {user.lastname}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-start">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Badge
                                            size="sm"
                                            color={
                                                user.role === "ADMIN"
                                                    ? "success"
                                                    : user.role === "OFFICER"
                                                        ? "warning"
                                                        : "primary"
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {new Date(user.CreatedAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

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
