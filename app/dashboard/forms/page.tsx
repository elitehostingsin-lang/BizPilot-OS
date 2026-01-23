"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Link as LinkIcon, ExternalLink } from "lucide-react";

export default function FormsPage() {
    const [forms, setForms] = useState([
        { id: 1, title: "Client Discovery", responses: 12, status: "Active" },
        { id: 2, title: "Project Feedback", responses: 5, status: "Active" },
        { id: 3, title: "Workshop Registration", responses: 0, status: "Draft" },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <GradientHeading size="sm">Form Builder</GradientHeading>
                <Button className="bg-blue-600 text-white"><Plus className="h-4 w-4 mr-2" /> Create Form</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form) => (
                    <div key={form.id} className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm hover:border-blue-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg">{form.title}</h3>
                            <Badge variant={form.status === 'Active' ? 'default' : 'secondary'}>{form.status}</Badge>
                        </div>

                        <div className="text-3xl font-bold mb-1">{form.responses}</div>
                        <div className="text-sm text-zinc-500 mb-6">Total Responses</div>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="w-full">Edit</Button>
                            <Button variant="secondary" size="sm" className="w-full">
                                <ExternalLink className="h-4 w-4 mr-2" /> View
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
