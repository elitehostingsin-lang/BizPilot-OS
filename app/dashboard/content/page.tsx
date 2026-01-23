"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Copy,
    Check,
    Save,
    MessageSquare,
    Linkedin,
    Mail
} from "lucide-react";

export default function ContentBuilderPage() {
    const [selectedCategory, setSelectedCategory] = useState("linkedin");
    const [content, setContent] = useState("");
    const [copied, setCopied] = useState(false);

    const templates: Record<string, string[]> = {
        linkedin: [
            "Just finished a major project with [Client Name]. Key takeaway: Communication is everything. #freelance #growth",
            "Excited to announce I'm now open for new opportunities in [Field]. DM me if you need help with [Service].",
            "Productivity Hack: Do the hardest thing first. It changes your entire day. Thoughts?"
        ],
        email: [
            "Hi [Name], I noticed you're looking for [Service]. I help businesses with exactly that. Let's chat?",
            "Following up on my previous email. Did you have a chance to review the proposal?",
            "Hi [Name], just wanted to say congrats on [Event]. I've been following your work for a while."
        ],
        ad: [
            "Stop struggling with [Problem]. Get [Solution] today for only [Price]. Limited time offer!",
            "Want to grow your business? Our [Service] is designed to help you scale fast. Click to learn more.",
            "[Question]? We have the answer. Try [Product] risk-free."
        ]
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <GradientHeading size="sm">Content Builder</GradientHeading>
                <Button variant="outline" className="gap-2">
                    <Save className="h-4 w-4" /> Save Template
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Categories */}
                <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Templates</h3>

                    <button
                        onClick={() => setSelectedCategory("linkedin")}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${selectedCategory === 'linkedin' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn Post
                    </button>

                    <button
                        onClick={() => setSelectedCategory("email")}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${selectedCategory === 'email' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                        <Mail className="h-4 w-4" />
                        Cold Email
                    </button>

                    <button
                        onClick={() => setSelectedCategory("ad")}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${selectedCategory === 'ad' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Ad Copy
                    </button>
                </div>

                {/* Main Editor */}
                <div className="md:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates[selectedCategory]?.map((temp, i) => (
                            <div
                                key={i}
                                onClick={() => setContent(temp)}
                                className="p-4 border rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-sm text-zinc-600 dark:text-zinc-300"
                            >
                                {temp}
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[300px] p-6 text-lg font-medium leading-relaxed resize-none bg-white dark:bg-zinc-900 shadow-sm"
                            placeholder="Select a template or start writing..."
                        />
                        <div className="absolute top-4 right-4">
                            <Button size="sm" variant="secondary" onClick={handleCopy} disabled={!content}>
                                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
