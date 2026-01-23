"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"; // Need to create table component, or use simple div structure if Table not in shadcn list I installed. 
// I did not create table component yet. I will scaffold simple table or create component.
// I will create a simple table structure in-line for now to save tool calls, or scaffold imports if they existed (they don't yet).
import {
    Plus,
    Search,
    MoreHorizontal,
    Phone,
    Mail
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LeadsPage() {
    const [leads, setLeads] = useState([
        { id: 1, name: "Acme Corp", contact: "John Doe", email: "john@acme.com", status: "New", value: "$5,000" },
        { id: 2, name: "Stark Ind", contact: "Tony S.", email: "tony@stark.com", status: "Negotiating", value: "$15,000" },
        { id: 3, name: "Wayne Ent", contact: "Bruce W.", email: "bruce@wayne.com", status: "Closed", value: "$12,000" },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <GradientHeading size="sm">Lead Tracker</GradientHeading>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input placeholder="Search leads..." className="pl-10" />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Plus className="h-4 w-4" /> Add Lead
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Business Name</th>
                                <th className="px-6 py-4">Contact Person</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Potential Value</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{lead.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span>{lead.contact}</span>
                                            <span className="text-zinc-500 text-xs">{lead.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className={
                                            lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                lead.status === 'Closed' ? 'bg-green-100 text-green-700' :
                                                    'bg-amber-100 text-amber-700'
                                        }>
                                            {lead.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{lead.value}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                        </Button>
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
