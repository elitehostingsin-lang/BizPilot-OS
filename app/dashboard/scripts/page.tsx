"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";

export default function ScriptsPage() {
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const scripts = [
        { id: 1, category: "Sales", title: "Cold Call Opener", content: "Hi [Name], this is [Your Name] from [Company]. Use this opener to establish rapport quickly..." },
        { id: 2, category: "Sales", title: "Handling Price Objection", content: "I completely understand that budget is a concern. Let's look at the ROI..." },
        { id: 3, category: "HR", title: "Interview Question - Culture", content: "Tell me about a time you disagreed with a team member. How did you handle it?" },
        { id: 4, category: "Support", title: "De-escalating Angry Customer", content: "I hear your frustration and I want to help solve this. First, let me..." },
    ];

    const handleCopy = (id: number, content: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            <GradientHeading size="sm">Script Library</GradientHeading>

            <div className="bg-white dark:bg-zinc-900 border rounded-xl p-4 flex gap-4 overflow-x-auto">
                <Badge className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-sm py-1">All</Badge>
                <Badge variant="outline" className="cursor-pointer text-sm py-1 bg-transparent">Sales</Badge>
                <Badge variant="outline" className="cursor-pointer text-sm py-1 bg-transparent">HR</Badge>
                <Badge variant="outline" className="cursor-pointer text-sm py-1 bg-transparent">Support</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scripts.map((script) => (
                    <div key={script.id} className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm flex flex-col justify-between gap-4">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="text-xs mb-2">{script.category}</Badge>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{script.title}</h3>
                            <p className="text-zinc-500 text-sm line-clamp-3">{script.content}</p>
                        </div>

                        <Button variant="outline" className="w-full" onClick={() => handleCopy(script.id, script.content)}>
                            {copiedId === script.id ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            {copiedId === script.id ? "Copied" : "Copy to Clipboard"}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
