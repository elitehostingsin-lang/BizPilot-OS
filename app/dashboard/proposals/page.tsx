"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Eye } from "lucide-react";

export default function ProposalsPage() {
    const [activeSection, setActiveSection] = useState("intro");
    const [proposal, setProposal] = useState({
        clientName: "",
        projectName: "",
        intro: "",
        scope: "",
        timeline: "",
        pricing: ""
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <GradientHeading size="sm">Proposal Builder</GradientHeading>
                <div className="flex gap-2">
                    <Button variant="outline"><Eye className="h-4 w-4 mr-2" /> Preview</Button>
                    <Button className="bg-blue-600 text-white"><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    {["Details", "Intro", "Scope", "Timeline", "Pricing"].map((sec) => (
                        <button
                            key={sec}
                            onClick={() => setActiveSection(sec.toLowerCase())}
                            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === sec.toLowerCase() ? 'bg-zinc-100 dark:bg-zinc-800 text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>

                <div className="md:col-span-3 bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm min-h-[500px]">
                    {activeSection === "details" && (
                        <div className="space-y-4 animate-in fade-in cursor-default">
                            <h3 className="font-semibold text-lg">Project Details</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Client Name</label>
                                <Input
                                    value={proposal.clientName}
                                    onChange={(e) => setProposal({ ...proposal, clientName: e.target.value })}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Title</label>
                                <Input
                                    value={proposal.projectName}
                                    onChange={(e) => setProposal({ ...proposal, projectName: e.target.value })}
                                    placeholder="e.g. Website Redesign"
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === "intro" && (
                        <div className="space-y-4 animate-in fade-in">
                            <h3 className="font-semibold text-lg">Introduction</h3>
                            <p className="text-sm text-zinc-500">Provide a brief overview of the project and your understanding.</p>
                            <Textarea
                                value={proposal.intro}
                                onChange={(e) => setProposal({ ...proposal, intro: e.target.value })}
                                className="h-64"
                                placeholder="We are excited to submit this proposal..."
                            />
                        </div>
                    )}

                    {/* Add other sections similarly (Scope, Timeline, Pricing) - keeping concise for artifact */}
                    {(activeSection !== "details" && activeSection !== "intro") && (
                        <div className="space-y-4 animate-in fade-in">
                            <h3 className="font-semibold text-lg capitalize">{activeSection}</h3>
                            <Textarea
                                className="h-64"
                                placeholder={`Detail the ${activeSection}...`}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
