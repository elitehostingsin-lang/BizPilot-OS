"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AuditPage() {
    const [url, setUrl] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<null | { score: number, issues: string[] }>(null);

    const analyze = () => {
        if (!url) return;
        setAnalyzing(true);
        // Simulate analysis
        setTimeout(() => {
            setResult({
                score: 72,
                issues: [
                    "Meta description missing",
                    "Images missing alt tags",
                    "Mobile viewport not optimized"
                ]
            });
            setAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
                <GradientHeading size="md">Website Audit</GradientHeading>
                <p className="text-zinc-500">Check your website health, SEO, and performance in one click.</p>
            </div>

            <div className="flex gap-4 max-w-2xl mx-auto">
                <Input
                    placeholder="https://yourwebsite.com"
                    className="h-12 text-lg"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Button size="lg" className="h-12 px-8 bg-blue-600 text-white" onClick={analyze} disabled={analyzing}>
                    {analyzing ? <Loader2 className="animate-spin h-5 w-5" /> : 'Run Audit'}
                </Button>
            </div>

            {result && (
                <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-center mb-8">
                        <div className="relative h-40 w-40 flex items-center justify-center">
                            <svg className="h-full w-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-zinc-100 dark:text-zinc-800" />
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * result.score) / 100} className={`text-blue-500 ${analyzing ? 'duration-1000' : 'duration-1000 transition-all ease-out'}`} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold">{result.score}</span>
                                <span className="text-sm text-zinc-500">Score</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Issues Found</h3>
                        {result.issues.map((issue, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-red-700 dark:text-red-400">
                                <XCircle className="h-5 w-5 flex-shrink-0" />
                                <span>{issue}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                            <span>HTTPS is enabled</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
